alter policy "stripe_connected_accounts_select_admin" on public.stripe_connected_accounts to authenticated;
alter policy "payments_select_member" on public.payments to authenticated;
alter policy "payments_insert_member" on public.payments to authenticated;
alter policy "payments_update_admin" on public.payments to authenticated;
alter policy "refunds_select_member" on public.refunds to authenticated;
alter policy "refunds_insert_admin" on public.refunds to authenticated;
