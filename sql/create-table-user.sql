drop table [User];

create table [User]
(
  [ID] integer primary key autoincrement,
  [Username] nvarchar(100) not null,
  [Email] nvarchar(255) not null,
  [Password] nvarchar(100) not null,
  [Salt] nvarchar(200) not null,
  [Active] int not null default 1
);
