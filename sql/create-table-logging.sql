drop table if exists [Logging];

create table [Logging]
(
  [ID] integer primary key autoincrement,
  [Event] nvarchar(30) not null,
  [Key] nvarchar(255) null,
  [Text] nvarchar(2000) not null
);
