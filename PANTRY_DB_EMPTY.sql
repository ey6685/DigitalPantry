-- MySQL dump 10.13  Distrib 8.0.14, for Win64 (x86_64)
--
-- Host: localhost    Database: digital_pantry
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL AUTO_INCREMENT,
  `ingredient_name` varchar(32) NOT NULL,
  `ingredient_weight` int(11) DEFAULT NULL,
  `ingredient_image_path` text,
  `ingredient_num_times_cooked` int(11) DEFAULT '0',
  `priority` enum('High','Low') DEFAULT 'Low',
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

--
-- Table structure for table `ingredients_in_a_recipe`
--

DROP TABLE IF EXISTS `ingredients_in_a_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients_in_a_recipe` (
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `pantry_id` int(11) NOT NULL,
  `amount_of_ingredient_needed` float NOT NULL,
  `ingredient_unit_of_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  KEY `recipe_id` (`recipe_id`),
  KEY `ingredient_id` (`ingredient_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_3` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_a_recipe`
--


--
-- Table structure for table `ingredients_in_pantry`
--

DROP TABLE IF EXISTS `ingredients_in_pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients_in_pantry` (
  `ingredient_id` int(11) NOT NULL,
  `pantry_id` int(11) DEFAULT NULL,
  `ingredient_amount` float DEFAULT NULL,
  `ingredient_unit_of_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  `ingredient_expiration_date` date DEFAULT NULL,
  KEY `ingredient_id` (`ingredient_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `ingredients_in_pantry_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `ingredients_in_pantry_ibfk_2` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_pantry`
--


--
-- Table structure for table `pantry`
--

DROP TABLE IF EXISTS `pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pantry` (
  `pantry_id` int(11) NOT NULL AUTO_INCREMENT,
  `pantry_name` varchar(255) DEFAULT NULL,
  `expire_window` int(11) DEFAULT '5',
  `pantry_image_path` text,
  `people_cooking_for` int(11) DEFAULT '2',
  PRIMARY KEY (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantry`
--

LOCK TABLES `pantry` WRITE;
/*!40000 ALTER TABLE `pantry` DISABLE KEYS */;
INSERT INTO `pantry` VALUES (1,'Jons digial checkin pantry',5,NULL,2),(2,'Jons digial checkin pantry',5,NULL,2),(3,'',5,NULL,2),(4,'',5,NULL,2),(5,'',5,NULL,2),(6,'',5,NULL,2),(7,'',5,NULL,2),(8,'',5,NULL,2),(9,'',5,NULL,2);
/*!40000 ALTER TABLE `pantry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_name` varchar(32) DEFAULT NULL,
  `recipe_image_path` text,
  `recipe_directions` text,
  `recipe_num_times_cooked` int(11) DEFAULT '0',
  `pantry_id` int(11) DEFAULT NULL,
  `num_people_it_feeds` int(11) DEFAULT '1',
  `sharable` tinyint(1) DEFAULT '0',
  `recipe_weight` int(11) DEFAULT '1',
  PRIMARY KEY (`recipe_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `username` varchar(32) DEFAULT NULL,
  `user_password` text,
  `user_email` tinytext,
  `pantry_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` enum('Volunteer','Administrator') DEFAULT 'Volunteer',
  PRIMARY KEY (`user_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('test','test','test@test.com',1,4,'Volunteer'),('admin','$2a$10$qotOtv0VfegBp36/muW9neIGJYPmv470PYR7oS11.Lrjwo/WUkd1y','et8492@wayne.edu',1,9,'Volunteer'),('admin','$2a$10$S5tTpwlmQEQY03U.G1mpbOWjU9wPGtApKX9RyiDMdc.gvQeWjJrsO','et8492@wayne.edu',1,10,'Volunteer'),('quastan@live.com','$2a$10$R0/SpFJOHHUyKiz5Yzy4xeUv33cgbdQ.bboHuY1Vl.4v8FiFpnh8W','quastan@live.com',1,11,'Administrator'),('admin','$2a$10$wRudyksT/2MCVOcj4TctVu5QrJg4gUlLQWKsTyJ8HDc5PYMBvHBsC','jenna291991@gmail.com',3,12,'Volunteer'),('admin','$2a$10$Zg3f7FieL/J6Ch9hHefSYuJ.e6PDZIJmiLk3oLRl0Xqm35ctsiZS6','pat9592@yahoo.com',8,15,'Volunteer'),('quastan@live.com','$2a$10$DOl83/1nofHtU/auUA4J6esckvkCOZt9qfgNJQxHE4E/rhgZHn0B6','quastan@live.com',1,16,'Volunteer'),('quastan@live.com','$2a$10$86EfDlHxR.Bw/Ki/5E1.SezL6DoSL.RR7UvGQtu9Z7yz/8qxSykS.','quastan@live.com',1,17,'Administrator'),('thisis@test.com','$2a$10$pOhWQpNZGnXPoSaAMQ0reuE0bx5MhlabdenGwkcT0gv03YbmkfRza','thisis@test.com',1,18,'Administrator'),('quastan@live.com','$2a$10$.hktGT/xusiDZoIRCYGDvukz/UoRw6AGhXa87RqmvXwpq4BhPr75S','quastan@live.com',1,19,'Administrator'),('admin','$2a$10$Un4KynrwZ38dqoKC5Wk2/uyvR6BW0ggrmckI8upbuyIYSfDELpo2a','pat9592@yahoo.com',9,20,'Volunteer'),('admin', '$2a$10$GpPtEiSt4V4v9QqQDpb8luATg3LdTc4oJi0Ml33RzNHbuxs82hNNy', 'test@wayne.edu', 1, 21, 'Administrator');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-01  1:30:06
