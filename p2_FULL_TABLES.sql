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
  `ingredient_num_times_cooked` int(11) DEFAULT NULL,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'Chicken',3,'/images/chicken.jpg',NULL),(2,'Canned Black Beans',1,'/images/black_beans.jpg',NULL),(3,'Carrot',3,'/images/placeholder.jpg',NULL),(4,'Potato chips',1,'/images/placeholder.jpg',NULL),(5,'Ground Pepper',0,'/images/placeholder.jpg',NULL),(6,'Chicken Broth',3,'/images/placeholder.jpg',NULL),(7,'Canned Tuna',1,'/images/placeholder.jpg',NULL),(8,'Frozen Mixed Vegetables',1,'/images/placeholder.jpg',NULL),(9,'Shredded Mozzarella Cheese',1,'/images/placeholder.jpg',NULL),(10,'Condensed Ckicken Soup',1,'/images/condensed_chicken.jpg',NULL),(11,'Water',0,'/images/water.jpg',NULL),(12,'Mixed Vegetables',2,'/images/mixed_veggies.jpg',NULL),(13,'Cream of Chicken Soup',1,'/images/placeholder.jpg',NULL),(14,'Milk',3,'/images/placeholder.jpg',NULL),(15,'Biscuits Mix',1,'/images/placeholder.jpg',NULL),(16,'Noodles',1,'/images/placeholder.jpg',NULL),(17,'Green Peas',2,'/images/placeholder.jpg',NULL),(18,'Cream of Mushroom Soup',1,'/images/placeholder.jpg',NULL),(19,'Tuna',2,'/images/placeholder.jpg',NULL),(20,'Onions',2,'/images/placeholder.jpg',NULL),(21,'French Bread',3,'/images/placeholder.jpg',NULL),(22,'Shredded Mozzarella Cheese',1,'/images/placeholder.jpg',NULL),(23,'Mayonnaise',1,'/images/placeholder.jpg',NULL),(24,'Corn',2,'/images/corn.jpg',NULL),(25,'Tortilla Chips',1,'/images/tortilla_chips.jpg',NULL),(26,'Salsa',2,'/images/placeholder.jpg',NULL),(27,'Canned Cream Corn',2,'/images/corn.jpg',NULL),(28,'Vegetable Oil',1,'/images/placeholder.jpg',NULL),(29,'Garlic',2,'/images/placeholder.jpg',NULL),(30,'Turkey',3,'/images/placeholder.jpg',NULL),(31,'Canned Diced Tomatoes',1,'/images/placeholder.jpg',NULL),(32,'Chili Powder',1,'/images/placeholder.jpg',NULL);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_a_recipe`
--

LOCK TABLES `ingredients_in_a_recipe` WRITE;
/*!40000 ALTER TABLE `ingredients_in_a_recipe` DISABLE KEYS */;
INSERT INTO `ingredients_in_a_recipe` VALUES (1,1,1,2,'cup'),(1,10,1,12,'oz'),(1,11,1,12,'oz'),(1,12,1,1,'cup'),(2,25,1,16,'oz'),(2,2,1,10,'oz'),(4,13,1,12,'oz'),(4,14,1,1,'cup'),(4,12,1,3,'cup'),(4,1,1,1,'lb'),(4,15,1,1,'cup'),(5,16,1,12,'oz'),(5,17,1,12,'cup'),(5,18,1,24,'oz'),(5,19,1,10,'oz'),(5,20,1,2,'oz'),(6,21,1,1,'lb'),(6,20,1,5,'oz'),(6,22,1,2,'cup'),(6,23,1,1,'cup'),(6,19,1,12,'oz'),(7,2,1,12,'oz'),(7,24,1,12,'oz'),(7,25,1,24,'oz'),(7,26,1,16,'oz'),(8,28,1,1,'tbsp.'),(8,20,1,5,'oz'),(8,29,1,2,'oz'),(8,30,1,1,'lb'),(8,2,1,45,'oz'),(8,31,1,15,'oz'),(8,32,1,2,'tbsp.');
/*!40000 ALTER TABLE `ingredients_in_a_recipe` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_pantry`
--

LOCK TABLES `ingredients_in_pantry` WRITE;
/*!40000 ALTER TABLE `ingredients_in_pantry` DISABLE KEYS */;
INSERT INTO `ingredients_in_pantry` VALUES (1,1,10,'cup','2019-03-30'),(3,1,5,'oz','2019-03-30'),(4,1,30,'oz','2019-03-30'),(5,1,4000,'lb','2019-03-30'),(6,1,360,'ml','2019-03-30'),(7,1,12,'lb','3000-10-10'),(8,1,2,'tbsp.','2222-02-02');
/*!40000 ALTER TABLE `ingredients_in_pantry` ENABLE KEYS */;
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
  PRIMARY KEY (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantry`
--

LOCK TABLES `pantry` WRITE;
/*!40000 ALTER TABLE `pantry` DISABLE KEYS */;
INSERT INTO `pantry` VALUES (1,'Jons digial checkin pantry'),(2,'Jons digial checkin pantry');
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
  `recipe_num_times_cooked` int(11) DEFAULT NULL,
  `pantry_id` int(11) DEFAULT NULL,
  `num_people_it_feeds` int(11) DEFAULT '1',
  `sharable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`recipe_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,'Chicken Noodle Soup','/images/chicken_noodle_soup.jpg','put ingredients into pot#boil and stir till cooked#serve warm',NULL,1,1,0),(2,'Chip n Beans','/images/bean_salsa.jpg','boil beans in pot#serve warm with chips',NULL,1,1,1),(4,'Ckicken Pot Pie','/images/chicken_pot_pie.jpg','Heat oil in wok or large skillet.#Add chicken. Cook until golden brown.#Add veggies. Cook for 2 minutes.#Add sauce. Cook for 2 minutes#Ready to serve!',NULL,1,5,0),(5,'Tuna Casserole','/images/placeholder.jpg',NULL,NULL,1,5,0),(6,'Tuna Melt','/images/placeholder.jpg',NULL,NULL,1,5,0),(7,'Black Bean Salsa','/images/bean_salsa.jpg',NULL,NULL,1,5,0),(8,'Black Bean Chili','/images/placeholder.jpg',NULL,NULL,1,10,0);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

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
  `user_type` enum('A','V') DEFAULT 'A',
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (NULL,NULL,NULL,NULL,'A',1),(NULL,NULL,NULL,NULL,'A',2),(NULL,NULL,NULL,NULL,'A',3),('test','test','et8492@wayne.edu',1,'A',4),(NULL,NULL,NULL,NULL,'A',5),(NULL,NULL,NULL,NULL,'A',6),(NULL,NULL,NULL,NULL,'A',7),(NULL,NULL,NULL,NULL,'A',8),('admin','$2a$10$tuX182ufZmM8Wk7K9z5lNORnzle6IT7YviA4fCRkqDDVxneWqLg0i','et8492@wayne.edu',1,'A',9),('admin','$2a$10$3xFmRl/4Oj5/xDdc81fJ/OIjGtRehJ6fU6ag4dN.ka3CJ12KHgYky','test@wayne.edu',1,'A',10);
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

-- Dump completed on 2019-03-18 14:21:23
