
# Setup docker and environment 

> docker-compose up 
This will setup postgres db and adminer 

In adminer 
add a new database `little_lives` 

# How to run 

> yarn 
> yarn dev 

The table will auto created

# Seed 
Seed all this in the db 
Configuration table 

> INSERT INTO "configuration" ("id", "created_at", "updated_at", "operation_day", "operation_day_name", "operation_start_time", "operation_end_time", "unavailable_hours") VALUES
(1,	'2024-11-16 03:39:12.758803+00',	'2024-11-16 03:39:12.758803+00',	1,	'monday',	'9:00',	'18:00',	'[{"to": "14:00", "from": "13:00"}]'),
(2,	'2024-11-16 03:39:12.758803+00',	'2024-11-16 03:39:12.758803+00',	2,	'tuesday',	'9:00',	'18:00',	'[{"to": "14:00", "from": "13:00"}]'),
(3,	'2024-11-16 03:39:12.758803+00',	'2024-11-16 03:39:12.758803+00',	3,	'wednesday',	'9:00',	'18:00',	'[{"to": "14:00", "from": "13:00"}]'),
(4,	'2024-11-16 03:39:12.758803+00',	'2024-11-16 03:39:12.758803+00',	4,	'thursday',	'9:00',	'18:00',	'[{"to": "14:00", "from": "13:00"}]'),
(5,	'2024-11-16 03:39:12.758803+00',	'2024-11-16 03:39:12.758803+00',	5,	'friday',	'9:00',	'18:00',	'[{"to": "14:00", "from": "13:00"}]');

Public holidy table 
> INSERT INTO "public_holiday" ("id", "created_at", "updated_at", "holiday_date") VALUES
(1,	'2024-11-16 04:43:36.226706+00',	'2024-11-16 04:43:36.226706+00',	'16-11-2024');

# API 
Get the available slots 

GET http://localhost:3777/appointment/available-slot/14-11-2024
(the date in dd-mm-yyyy format)

create the appointment 

POST http://localhost:3777/appointment/create

body 
{
    "date" :"17-11-2024",
    "time" :"10:00"
}


Sorry, no time to write this README in a nicely way, not enough time
and also the commit message, no time for that as well 
Have a lot need to do, validation etc, 
when have time, we talk more about it. 
Thanks for reading 
