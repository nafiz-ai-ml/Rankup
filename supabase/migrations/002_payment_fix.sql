drop function if exists process_successful_payment(uuid, text, text, text, integer, jsonb);

create or replace function process_successful_payment(
  p_payment_id uuid,
  p_listing_id uuid,
  p_event_id text,
  p_transaction_id text,
  p_email text,
  p_paid_minor bigint,
  p_payload jsonb
) returns text as $$
declare
  v_amount integer;
  v_status text;
begin
  perform pg_advisory_xact_lock(918273645);

  if exists (select 1 from payments where paddle_event_id = p_event_id) then
    return 'duplicate';
  end if;

  select amount_usd, status into v_amount, v_status
  from payments
  where id = p_payment_id and listing_id = p_listing_id
  for update;

  if not found then return 'not_found'; end if;
  if v_status = 'succeeded' then return 'duplicate'; end if;
  if p_paid_minor <> v_amount::bigint * 100 then return 'mismatch'; end if;

  update payments set
    status = 'succeeded',
    paddle_event_id = p_event_id,
    paddle_transaction_id = p_transaction_id,
    paddle_customer_email = p_email,
    boost_window_expires_at = now() + interval '15 minutes',
    raw_payload = p_payload
  where id = p_payment_id;

  insert into listing_spend (listing_id, all_time_total, today_total, today_date, last_paid_at)
  values (p_listing_id, v_amount, v_amount, current_date, now())
  on conflict (listing_id) do update set
    all_time_total = listing_spend.all_time_total + v_amount,
    today_total = case when listing_spend.today_date = current_date
                       then listing_spend.today_total + v_amount else v_amount end,
    today_date = current_date,
    last_paid_at = now(),
    updated_at = now();

  update listings set
    status = 'active',
    first_paid_at = coalesce(first_paid_at, now()),
    expires_at = now() + interval '7 days',
    updated_at = now()
  where id = p_listing_id;

  insert into rank_events (listing_id, event_type, amount_usd)
  values (p_listing_id, 'boosted', v_amount);

  return 'ok';
end;
$$ language plpgsql;

