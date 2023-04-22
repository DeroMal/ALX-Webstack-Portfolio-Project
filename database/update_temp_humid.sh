#!/bin/bash
mysql -u <username> -p<password> <database> -e "INSERT INTO temp_humid (dateTime, temperature, humidity)
SELECT t.dateTime, t.temperature, h.humidityi
FROM temperature_data t
JOIN humidity_data h ON t.dateTime = h.dateTime
WHERE t.dateTime = (SELECT MAX(dateTime) FROM temperature_data)
  AND h.dateTime = (SELECT MAX(dateTime) FROM humidity_data);"
