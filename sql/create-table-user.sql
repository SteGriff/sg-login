drop table if exists [User];

create table [User]
(
  [ID] integer primary key autoincrement,
  [Username] nvarchar(100) not null,
  [Email] nvarchar(255) null,
  [Password] nvarchar(100) not null,
  [Salt] nvarchar(200) not null,
  [Active] int not null default 1
);
