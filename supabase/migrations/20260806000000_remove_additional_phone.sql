-- Remove retired "Additional" clinic phone (9851063249) from public contact lists.
delete from phones
where number in ('9851063249', '985-1063249')
   or (role = 'additional' and label = 'Additional');
