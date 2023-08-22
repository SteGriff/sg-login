select ID, datetime(Created, 'unixepoch', 'localtime'), Event, Key, Text
from [Logging]
order by ID desc
limit 100