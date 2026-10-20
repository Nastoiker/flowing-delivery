-- Только пустой учебный volume: исторический dump с данными не импортируется.
-- Один владелец для четырёх баз — упрощение лаборатории, не изоляция production.
CREATE DATABASE banner OWNER delivery;
CREATE DATABASE event OWNER delivery;
CREATE DATABASE payment OWNER delivery;
