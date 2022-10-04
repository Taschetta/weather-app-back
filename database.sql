
CREATE DATABASE IF NOT EXISTS weather_app;

CREATE TABLE weather_app.user (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE weather_app.session (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  userId INT UNSIGNED NOT NULL,
  refreshToken VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES user (id)
);

CREATE TABLE weather_app.favourite (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  userId INT UNSIGNED NOT NULL,
  lattitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES user (id)
);

CREATE TABLE weather_app.alert_property (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE weather_app.alert_condition (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE weather_app.alert (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  userId INT UNSIGNED NOT NULL,
  propertyId INT UNSIGNED NOT NULL,
  conditionId INT UNSIGNED NOT NULL,
  lattitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  value DOUBLE NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES user (id),
  FOREIGN KEY (propertyId) REFERENCES alert_property (id),
  FOREIGN KEY (conditionId) REFERENCES alert_condition (id)
);

INSERT INTO weather_app.alert_property (id, name) values (1, 'Temperature'), (2, 'Feels Like'), (3, 'Maximum'), (4, 'Minimum');
INSERT INTO weather_app.alert_condition (id, name) values (1, 'Above'), (2, 'Below');