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
-- Table structure for table `community_recipe_ingredient`
--

DROP TABLE IF EXISTS `community_recipe_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `community_recipe_ingredient` (
  `c_recipe_id` int(11) DEFAULT NULL,
  `c_recipe_ingredient_used` varchar(32) DEFAULT NULL,
  `c_recipe_ingredient_qty` float DEFAULT NULL,
  `c_recipe_measurement_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_recipe_ingredient`
--

LOCK TABLES `community_recipe_ingredient` WRITE;
/*!40000 ALTER TABLE `community_recipe_ingredient` DISABLE KEYS */;
INSERT INTO `community_recipe_ingredient` VALUES (1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart'),(1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart'),(1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart'),(1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart'),(1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart'),(1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart'),(1,'Chicken',1,'lb'),(1,'Black beans',16,'oz'),(1,'Salsa',1,'quart');
/*!40000 ALTER TABLE `community_recipe_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_recipes`
--

DROP TABLE IF EXISTS `community_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `community_recipes` (
  `c_recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_recipe_name` varchar(32) NOT NULL,
  `c_recipe_serving_size` float NOT NULL,
  `c_recipe_directions` tinytext,
  `c_recipe_image_path` tinytext,
  PRIMARY KEY (`c_recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_recipes`
--

LOCK TABLES `community_recipes` WRITE;
/*!40000 ALTER TABLE `community_recipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL AUTO_INCREMENT,
  `ingredient_name` varchar(255) NOT NULL,
  `ingredient_total` float DEFAULT '1',
  `ingredient_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  `ingredient_expiration_date` date DEFAULT NULL,
  `ingredient_image_path` text,
  `ingredient_weight` int(11) DEFAULT NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE KEY `unique_ingredient` (`ingredient_name`,`ingredient_measurement`,`ingredient_expiration_date`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'Chicken',1,'lb','2019-02-07',NULL,NULL),(2,'Black beans',1,'oz','2019-02-08',NULL,NULL),(3,'Salsa',16,'oz','2019-02-10',NULL,NULL),(4,'Corn',1,'oz','2019-02-10',NULL,NULL),(5,'Tortilla Chips',1,'oz','2019-02-10',NULL,NULL),(6,'Condensed Chicken Soup',1,'oz','2019-02-10',NULL,NULL),(7,'Mixed vegetables',1,'oz','2019-02-10',NULL,NULL),(8,'Water',99,NULL,NULL,NULL,NULL),(18,'test',1,'tsp.','3000-12-12',NULL,NULL);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantry`
--

DROP TABLE IF EXISTS `pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pantry` (
  `pantry_id` int(11) NOT NULL AUTO_INCREMENT,
  `pantry_name` varchar(255) DEFAULT NULL,
  `pantry_ingredients_used_month` int(11) DEFAULT '0',
  `pantry_ingredients_wasted_month` int(11) DEFAULT '0',
  `pantry_ingredients_used_YTD` int(11) DEFAULT '0',
  `pantry_ingredients_wasted_YTD` int(11) DEFAULT '0',
  `recipes_cooked_month` int(11) DEFAULT '0',
  `recipes_cooked_YTD` int(11) DEFAULT '0',
  PRIMARY KEY (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantry`
--

LOCK TABLES `pantry` WRITE;
/*!40000 ALTER TABLE `pantry` DISABLE KEYS */;
/*!40000 ALTER TABLE `pantry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantry_stats`
--

DROP TABLE IF EXISTS `pantry_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pantry_stats` (
  `pantry_id` int(11) NOT NULL AUTO_INCREMENT,
  `pantry_name` varchar(32) DEFAULT NULL,
  `pantry_month` enum('January','February','March','April','May','June','July','August','September','October','November','December') DEFAULT NULL,
  `pantry_monthy_exipred_ingredients` int(11) DEFAULT NULL,
  `pantry_monthy_total_exipred` int(11) DEFAULT NULL,
  PRIMARY KEY (`pantry_id`),
  UNIQUE KEY `pantry_id` (`pantry_id`,`pantry_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantry_stats`
--

LOCK TABLES `pantry_stats` WRITE;
/*!40000 ALTER TABLE `pantry_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `pantry_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredient`
--

DROP TABLE IF EXISTS `recipe_ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `recipe_ingredient` (
  `recipe_id` int(11) DEFAULT NULL,
  `recipe_ingredient_qty` float DEFAULT '1',
  `recipe_ingredient_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  `recipe_pantry_id` int(11) DEFAULT NULL,
  `recipe_ingredient_used` varchar(32) DEFAULT NULL,
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `recipe_ingredient_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredient`
--

LOCK TABLES `recipe_ingredient` WRITE;
/*!40000 ALTER TABLE `recipe_ingredient` DISABLE KEYS */;
INSERT INTO `recipe_ingredient` VALUES (1,1,'oz',1,'Black beans'),(1,1,'oz',1,'Corn'),(1,16,'oz',1,'Salsa'),(1,1,'oz',1,'Tortilla Chips'),(2,1,'oz',1,'Condensed Chicken Soup'),(2,1,'oz',1,'Water'),(2,1,'oz',1,'Mixed vegetables'),(2,1,'oz',1,'Chicken');
/*!40000 ALTER TABLE `recipe_ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_name` varchar(255) DEFAULT NULL,
  `recipe_serving_size` int(11) DEFAULT NULL,
  `recipe_pantry_id` int(11) DEFAULT NULL,
  `recipe_directions` text,
  `recipe_image_path` text,
  `recipe_sharable` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,'Black bean salsa',6,1,'#Drain canned beans and corn#Put them in a large bowl and mix together#Serve on tortillas or with chips.',NULL,1),(2,'Chicken noodle soup',4,1,'#Put ingredients into a large bow together#Cover bowl, then microwave for 3 minutes on high#Serve hot with crackers or bread','/images/chicken_noodle_soup.jpg',1);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('c_recipe_ingredient.js'),('Ingredients_create_table.js'),('pantry_create_table.js'),('recipe_ingredient_create_table.js'),('recipes_create_table.js'),('Users_create_table.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `user_pantry_id` int(11) DEFAULT '1',
  `user_type` enum('P','NP') DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@test.com','test',1,'P'),(2,'test@test.com','test',1,'P');
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

-- Dump completed on 2019-03-01 20:03:50
