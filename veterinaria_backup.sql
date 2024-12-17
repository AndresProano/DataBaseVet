-- MySQL dump 10.13  Distrib 9.0.1, for macos14 (arm64)
--
-- Host: localhost    Database: veterinaria
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `idcitas` int NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `motivo` varchar(500) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `mascotas_idmascotas` int NOT NULL,
  `veterinarios_idveterinarios` int NOT NULL,
  `tratamientos_idtratamientos` int DEFAULT NULL,
  PRIMARY KEY (`idcitas`),
  UNIQUE KEY `idcitas_UNIQUE` (`idcitas`),
  KEY `fk_citas_mascotas1_idx` (`mascotas_idmascotas`),
  KEY `fk_citas_veterinarios1_idx` (`veterinarios_idveterinarios`),
  KEY `fk_citas_tratamientos1_idx` (`tratamientos_idtratamientos`),
  CONSTRAINT `fk_citas_mascotas1` FOREIGN KEY (`mascotas_idmascotas`) REFERENCES `mascotas` (`idmascotas`),
  CONSTRAINT `fk_citas_tratamientos1` FOREIGN KEY (`tratamientos_idtratamientos`) REFERENCES `tratamientos` (`idtratamientos`),
  CONSTRAINT `fk_citas_veterinarios1` FOREIGN KEY (`veterinarios_idveterinarios`) REFERENCES `veterinarios` (`idveterinarios`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,'2024-01-10','09:00:00','Consulta por control','Completada',1,4,1),(2,'2024-02-01','10:30:00','Problemas en la piel','Completada',2,2,2),(3,'2024-02-20','11:15:00','Limpieza dental','Completada',3,3,3),(4,'2024-03-01','15:00:00','Desparasitación','Completada',4,4,4),(5,'2024-03-15','16:30:00','Chequeo rutinario','Programada',5,5,5),(7,'2024-12-01','10:30:00','Consulta por control','Confirmada',3,2,12),(8,'2024-12-01','14:30:00','Control Rutinario','Completada',7,2,NULL);
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `duenos`
--

DROP TABLE IF EXISTS `duenos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `duenos` (
  `idduenos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idduenos`),
  UNIQUE KEY `idduenos_UNIQUE` (`idduenos`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `duenos`
--

LOCK TABLES `duenos` WRITE;
/*!40000 ALTER TABLE `duenos` DISABLE KEYS */;
INSERT INTO `duenos` VALUES (1,'Juan','Pérez','555-0101','juan.perez@email.com','Calle Principal 123'),(2,'María','González','555-0202','maria.gon@email.com','Avenida Central 456'),(3,'Carlos','Rodríguez','555-0303','carlos.rod@email.com','Plaza Mayor 789'),(4,'Ana','Martínez','555-0404','ana.mar@email.com','Calle Secundaria 321'),(5,'Luis','Sánchez','555-0505','luis.san@email.com','Avenida Norte 654'),(6,'Mario','Tapia','983981531','mario.tapia@gmail.com','Quito'),(7,'Andres','Proano','555-1234','andresproano@gmail.com','la Atahualpa');
/*!40000 ALTER TABLE `duenos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidad`
--

DROP TABLE IF EXISTS `especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidad` (
  `idespecialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `anios_requeridos` int DEFAULT NULL,
  PRIMARY KEY (`idespecialidad`),
  UNIQUE KEY `idespecialidad_UNIQUE` (`idespecialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidad`
--

LOCK TABLES `especialidad` WRITE;
/*!40000 ALTER TABLE `especialidad` DISABLE KEYS */;
INSERT INTO `especialidad` VALUES (1,'Cirugía','Especialización en procedimientos quirúrgicos',3),(2,'Dermatología','Tratamiento de enfermedades de la piel',2),(3,'Cardiología','Especialización en sistema cardiovascular',3),(4,'Odontología','Cuidado dental y oral',2),(5,'Neurología','Especialización en sistema nervioso',4),(6,'General','Medico General',1);
/*!40000 ALTER TABLE `especialidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especies`
--

DROP TABLE IF EXISTS `especies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especies` (
  `idespecies` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idespecies`),
  UNIQUE KEY `idespecies_UNIQUE` (`idespecies`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especies`
--

LOCK TABLES `especies` WRITE;
/*!40000 ALTER TABLE `especies` DISABLE KEYS */;
INSERT INTO `especies` VALUES (1,'Perro','Canis lupus familiaris, animal doméstico común'),(2,'Gato','Felis catus, felino doméstico'),(3,'Conejo','Oryctolagus cuniculus, mamífero de la familia Leporidae'),(4,'Pájaro','Aves pequeñas domésticas'),(5,'Hámster','Cricetinae, roedor pequeño de la familia de los cricétidos');
/*!40000 ALTER TABLE `especies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
  `idfacturas` int NOT NULL AUTO_INCREMENT,
  `fecha_emision` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `iva` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado_pago` varchar(45) DEFAULT NULL,
  `metodo_pago` varchar(45) DEFAULT NULL,
  `duenos_idduenos` int NOT NULL,
  PRIMARY KEY (`idfacturas`),
  KEY `fk_facturas_duenos1_idx` (`duenos_idduenos`),
  CONSTRAINT `fk_facturas_duenos1` FOREIGN KEY (`duenos_idduenos`) REFERENCES `duenos` (`idduenos`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas`
--

LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
INSERT INTO `facturas` VALUES (1,'2024-01-10','2024-01-24',100.00,16.00,116.00,'Pagada','Tarjeta',1),(2,'2024-02-01','2024-02-15',150.00,24.00,174.00,'Pagada','Efectivo',2),(3,'2024-02-20','2024-03-05',200.00,32.00,232.00,'Pendiente','Transferencia',3),(4,'2024-03-01','2024-03-15',75.00,12.00,87.00,'Pagada','Tarjeta',4),(5,'2024-03-15','2024-03-29',125.00,20.00,145.00,'Pendiente','Efectivo',5);
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
  `idmascotas` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `fechanacimiento` date DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `especies_idespecies` int NOT NULL,
  `duenos_idduenos` int NOT NULL,
  PRIMARY KEY (`idmascotas`),
  UNIQUE KEY `idmascotas_UNIQUE` (`idmascotas`),
  KEY `fk_mascotas_especies1_idx` (`especies_idespecies`),
  KEY `fk_mascotas_duenos1_idx` (`duenos_idduenos`),
  CONSTRAINT `fk_mascotas_duenos1` FOREIGN KEY (`duenos_idduenos`) REFERENCES `duenos` (`idduenos`),
  CONSTRAINT `fk_mascotas_especies1` FOREIGN KEY (`especies_idespecies`) REFERENCES `especies` (`idespecies`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT INTO `mascotas` VALUES (1,'Max','2020-03-15',25.50,1,1),(2,'Luna','2020-06-20',4.20,2,2),(3,'Coco','2020-12-10',1.50,3,3),(4,'Pío','2022-01-05',0.30,4,4),(5,'Rocky','2021-09-30',30.20,1,5),(7,'Manuel','2022-12-02',5.00,3,7);
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascotas_has_tratamientos`
--

DROP TABLE IF EXISTS `mascotas_has_tratamientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas_has_tratamientos` (
  `mascotas_idmascotas` int NOT NULL,
  `tratamientos_idtratamientos` int NOT NULL,
  `notas` varchar(500) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`mascotas_idmascotas`,`tratamientos_idtratamientos`),
  KEY `fk_mascotas_has_tratamientos_tratamientos1_idx` (`tratamientos_idtratamientos`),
  KEY `fk_mascotas_has_tratamientos_mascotas1_idx` (`mascotas_idmascotas`),
  CONSTRAINT `fk_mascotas_has_tratamientos_mascotas1` FOREIGN KEY (`mascotas_idmascotas`) REFERENCES `mascotas` (`idmascotas`),
  CONSTRAINT `fk_mascotas_has_tratamientos_tratamientos1` FOREIGN KEY (`tratamientos_idtratamientos`) REFERENCES `tratamientos` (`idtratamientos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas_has_tratamientos`
--

LOCK TABLES `mascotas_has_tratamientos` WRITE;
/*!40000 ALTER TABLE `mascotas_has_tratamientos` DISABLE KEYS */;
INSERT INTO `mascotas_has_tratamientos` VALUES (1,1,'Responde bien al tratamiento','2024-01-10'),(2,2,'Mejoría visible en la piel','2024-02-01'),(3,3,'Procedimiento sin complicaciones','2024-02-20'),(3,12,NULL,NULL),(4,4,'Tratamiento preventivo exitoso','2024-03-01'),(5,5,'Sin novedades importantes','2024-03-15');
/*!40000 ALTER TABLE `mascotas_has_tratamientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamentos`
--

DROP TABLE IF EXISTS `medicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamentos` (
  `idmedicamentos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idmedicamentos`),
  UNIQUE KEY `idmedicamentos_UNIQUE` (`idmedicamentos`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamentos`
--

LOCK TABLES `medicamentos` WRITE;
/*!40000 ALTER TABLE `medicamentos` DISABLE KEYS */;
INSERT INTO `medicamentos` VALUES (1,'Amoxicilina','Antibiótico de amplio espectro',100,25.50),(2,'Rimadyl','Antiinflamatorio para dolor',80,35.75),(3,'Frontline','Antiparasitario externo',150,45.00),(4,'Drontal','Desparasitante interno',120,28.90),(5,'Vitaminas Plus','Suplemento vitamínico',200,15.25);
/*!40000 ALTER TABLE `medicamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamentos_has_tratamientos`
--

DROP TABLE IF EXISTS `medicamentos_has_tratamientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamentos_has_tratamientos` (
  `dosis` varchar(100) DEFAULT NULL,
  `medicamentos_idmedicamentos` int NOT NULL,
  `tratamientos_idtratamientos` int NOT NULL,
  `frecuencia` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`medicamentos_idmedicamentos`,`tratamientos_idtratamientos`),
  KEY `fk_medicamentos_has_tratamientos_tratamientos1_idx` (`tratamientos_idtratamientos`),
  KEY `fk_medicamentos_has_tratamientos_medicamentos1_idx` (`medicamentos_idmedicamentos`),
  CONSTRAINT `fk_medicamentos_has_tratamientos_medicamentos1` FOREIGN KEY (`medicamentos_idmedicamentos`) REFERENCES `medicamentos` (`idmedicamentos`),
  CONSTRAINT `fk_medicamentos_has_tratamientos_tratamientos1` FOREIGN KEY (`tratamientos_idtratamientos`) REFERENCES `tratamientos` (`idtratamientos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamentos_has_tratamientos`
--

LOCK TABLES `medicamentos_has_tratamientos` WRITE;
/*!40000 ALTER TABLE `medicamentos_has_tratamientos` DISABLE KEYS */;
INSERT INTO `medicamentos_has_tratamientos` VALUES ('250mg',1,1,'Cada 8 horas'),('100mg',2,2,'Cada 24 horas'),('1 pipeta',3,2,'Mensual'),('1 tableta',4,4,'Dosis única'),('5ml',5,5,'Cada 12 horas');
/*!40000 ALTER TABLE `medicamentos_has_tratamientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamientos`
--

DROP TABLE IF EXISTS `tratamientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamientos` (
  `idtratamientos` int NOT NULL AUTO_INCREMENT,
  `diagnostico` varchar(100) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`idtratamientos`),
  UNIQUE KEY `idtratamientos_UNIQUE` (`idtratamientos`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamientos`
--

LOCK TABLES `tratamientos` WRITE;
/*!40000 ALTER TABLE `tratamientos` DISABLE KEYS */;
INSERT INTO `tratamientos` VALUES (1,'Infección bacterial','2024-01-10','2024-01-24'),(2,'Dermatitis alérgica','2024-02-01','2024-02-15'),(3,'Control dental','2024-02-20','2024-02-21'),(4,'Parasitosis','2024-03-01','2024-03-08'),(5,'Chequeo general','2024-03-15','2024-03-15'),(6,'así','2024-11-01','2024-12-01'),(7,'asd','2024-12-01','2024-12-10'),(12,'Control Rutinario','2024-12-01','2024-12-02');
/*!40000 ALTER TABLE `tratamientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_facturas_completas`
--

DROP TABLE IF EXISTS `v_facturas_completas`;
/*!50001 DROP VIEW IF EXISTS `v_facturas_completas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_facturas_completas` AS SELECT 
 1 AS `idfacturas`,
 1 AS `fecha_emision`,
 1 AS `fecha_vencimiento`,
 1 AS `subtotal`,
 1 AS `iva`,
 1 AS `total`,
 1 AS `estado_pago`,
 1 AS `metodo_pago`,
 1 AS `dueno_nombre`,
 1 AS `dueno_apellido`,
 1 AS `dueno_telefono`,
 1 AS `dueno_email`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_mascotas_info`
--

DROP TABLE IF EXISTS `v_mascotas_info`;
/*!50001 DROP VIEW IF EXISTS `v_mascotas_info`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_mascotas_info` AS SELECT 
 1 AS `idmascotas`,
 1 AS `mascota_nombre`,
 1 AS `fechanacimiento`,
 1 AS `peso`,
 1 AS `idduenos`,
 1 AS `dueno_nombre`,
 1 AS `dueno_apellido`,
 1 AS `dueno_telefono`,
 1 AS `idespecies`,
 1 AS `especie_nombre`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_tratamientos_completos`
--

DROP TABLE IF EXISTS `v_tratamientos_completos`;
/*!50001 DROP VIEW IF EXISTS `v_tratamientos_completos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_tratamientos_completos` AS SELECT 
 1 AS `idtratamientos`,
 1 AS `diagnostico`,
 1 AS `fecha_inicio`,
 1 AS `fecha_fin`,
 1 AS `idmascotas`,
 1 AS `mascota_nombre`,
 1 AS `especie_nombre`,
 1 AS `dueno_nombre`,
 1 AS `dueno_apellido`,
 1 AS `dueno_telefono`,
 1 AS `veterinario_nombre`,
 1 AS `veterinario_apellido`,
 1 AS `motivo_cita`,
 1 AS `medicamentos`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_tratamientos_mascotas`
--

DROP TABLE IF EXISTS `v_tratamientos_mascotas`;
/*!50001 DROP VIEW IF EXISTS `v_tratamientos_mascotas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_tratamientos_mascotas` AS SELECT 
 1 AS `idmascotas`,
 1 AS `mascota_nombre`,
 1 AS `dueno_nombre`,
 1 AS `especie_nombre`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_veterinarios_info`
--

DROP TABLE IF EXISTS `v_veterinarios_info`;
/*!50001 DROP VIEW IF EXISTS `v_veterinarios_info`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_veterinarios_info` AS SELECT 
 1 AS `idveterinarios`,
 1 AS `nombre`,
 1 AS `apellido`,
 1 AS `telefono`,
 1 AS `email`,
 1 AS `especialidades`,
 1 AS `especialidad_ids`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `veterinarios`
--

DROP TABLE IF EXISTS `veterinarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veterinarios` (
  `idveterinarios` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idveterinarios`),
  UNIQUE KEY `idveterinarios_UNIQUE` (`idveterinarios`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veterinarios`
--

LOCK TABLES `veterinarios` WRITE;
/*!40000 ALTER TABLE `veterinarios` DISABLE KEYS */;
INSERT INTO `veterinarios` VALUES (1,'Roberto','García','555-1001','roberto.gar@vet.com'),(2,'Laura','López','555-1002','laura.lop@vet.com'),(3,'Diego','Torres','555-1003','diego.tor@vet.com'),(4,'Carmen','Ruiz','555-1004','carmen.rui@vet.com'),(5,'Miguel','Flores','555-1005','miguel.flo@vet.com'),(7,'Alejandro','Pazmiño','555-3214','alejo.paz@vet.com');
/*!40000 ALTER TABLE `veterinarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veterinarios_has_especialidad`
--

DROP TABLE IF EXISTS `veterinarios_has_especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veterinarios_has_especialidad` (
  `veterinarios_idveterinarios` int NOT NULL,
  `especialidad_idespecialidad` int NOT NULL,
  `fecha_certificacion` date DEFAULT NULL,
  PRIMARY KEY (`veterinarios_idveterinarios`,`especialidad_idespecialidad`),
  KEY `fk_veterinarios_has_especialidad_especialidad1_idx` (`especialidad_idespecialidad`),
  KEY `fk_veterinarios_has_especialidad_veterinarios1_idx` (`veterinarios_idveterinarios`),
  CONSTRAINT `fk_veterinarios_has_especialidad_especialidad1` FOREIGN KEY (`especialidad_idespecialidad`) REFERENCES `especialidad` (`idespecialidad`),
  CONSTRAINT `fk_veterinarios_has_especialidad_veterinarios1` FOREIGN KEY (`veterinarios_idveterinarios`) REFERENCES `veterinarios` (`idveterinarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veterinarios_has_especialidad`
--

LOCK TABLES `veterinarios_has_especialidad` WRITE;
/*!40000 ALTER TABLE `veterinarios_has_especialidad` DISABLE KEYS */;
INSERT INTO `veterinarios_has_especialidad` VALUES (1,1,'2020-01-15'),(1,2,'2021-03-20'),(2,3,'2019-11-30'),(3,4,'2022-02-10'),(4,5,'2021-07-25'),(5,6,'2024-12-01'),(7,2,'2024-12-01');
/*!40000 ALTER TABLE `veterinarios_has_especialidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_citas_completa`
--

DROP TABLE IF EXISTS `vista_citas_completa`;
/*!50001 DROP VIEW IF EXISTS `vista_citas_completa`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_citas_completa` AS SELECT 
 1 AS `idcitas`,
 1 AS `fecha`,
 1 AS `hora`,
 1 AS `motivo`,
 1 AS `estado`,
 1 AS `mascota_nombre`,
 1 AS `mascota_peso`,
 1 AS `especie`,
 1 AS `dueno_nombre`,
 1 AS `dueno_apellido`,
 1 AS `dueno_telefono`,
 1 AS `veterinario_nombre`,
 1 AS `veterinario_apellido`,
 1 AS `especialidades`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_facturas_completas`
--

/*!50001 DROP VIEW IF EXISTS `v_facturas_completas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_facturas_completas` AS select `f`.`idfacturas` AS `idfacturas`,`f`.`fecha_emision` AS `fecha_emision`,`f`.`fecha_vencimiento` AS `fecha_vencimiento`,`f`.`subtotal` AS `subtotal`,`f`.`iva` AS `iva`,`f`.`total` AS `total`,`f`.`estado_pago` AS `estado_pago`,`f`.`metodo_pago` AS `metodo_pago`,`d`.`nombre` AS `dueno_nombre`,`d`.`apellido` AS `dueno_apellido`,`d`.`telefono` AS `dueno_telefono`,`d`.`email` AS `dueno_email` from (`facturas` `f` join `duenos` `d` on((`f`.`duenos_idduenos` = `d`.`idduenos`))) order by `f`.`fecha_emision` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_mascotas_info`
--

/*!50001 DROP VIEW IF EXISTS `v_mascotas_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_mascotas_info` AS select `m`.`idmascotas` AS `idmascotas`,`m`.`nombre` AS `mascota_nombre`,`m`.`fechanacimiento` AS `fechanacimiento`,`m`.`peso` AS `peso`,`d`.`idduenos` AS `idduenos`,`d`.`nombre` AS `dueno_nombre`,`d`.`apellido` AS `dueno_apellido`,`d`.`telefono` AS `dueno_telefono`,`e`.`idespecies` AS `idespecies`,`e`.`nombre` AS `especie_nombre` from ((`mascotas` `m` join `duenos` `d` on((`m`.`duenos_idduenos` = `d`.`idduenos`))) join `especies` `e` on((`m`.`especies_idespecies` = `e`.`idespecies`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_tratamientos_completos`
--

/*!50001 DROP VIEW IF EXISTS `v_tratamientos_completos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_tratamientos_completos` AS select `t`.`idtratamientos` AS `idtratamientos`,`t`.`diagnostico` AS `diagnostico`,`t`.`fecha_inicio` AS `fecha_inicio`,`t`.`fecha_fin` AS `fecha_fin`,`m`.`idmascotas` AS `idmascotas`,`m`.`nombre` AS `mascota_nombre`,`e`.`nombre` AS `especie_nombre`,`d`.`nombre` AS `dueno_nombre`,`d`.`apellido` AS `dueno_apellido`,`d`.`telefono` AS `dueno_telefono`,`v`.`nombre` AS `veterinario_nombre`,`v`.`apellido` AS `veterinario_apellido`,`c`.`motivo` AS `motivo_cita`,group_concat(distinct concat(`med`.`nombre`,' - ',`mht`.`dosis`,' (',`mht`.`frecuencia`,')') separator '; ') AS `medicamentos` from ((((((((`tratamientos` `t` join `mascotas_has_tratamientos` `mht_link` on((`t`.`idtratamientos` = `mht_link`.`tratamientos_idtratamientos`))) join `mascotas` `m` on((`mht_link`.`mascotas_idmascotas` = `m`.`idmascotas`))) join `especies` `e` on((`m`.`especies_idespecies` = `e`.`idespecies`))) join `duenos` `d` on((`m`.`duenos_idduenos` = `d`.`idduenos`))) join `citas` `c` on((`c`.`tratamientos_idtratamientos` = `t`.`idtratamientos`))) join `veterinarios` `v` on((`c`.`veterinarios_idveterinarios` = `v`.`idveterinarios`))) left join `medicamentos_has_tratamientos` `mht` on((`t`.`idtratamientos` = `mht`.`tratamientos_idtratamientos`))) left join `medicamentos` `med` on((`mht`.`medicamentos_idmedicamentos` = `med`.`idmedicamentos`))) group by `t`.`idtratamientos`,`t`.`diagnostico`,`t`.`fecha_inicio`,`t`.`fecha_fin`,`m`.`idmascotas`,`m`.`nombre`,`e`.`nombre`,`d`.`nombre`,`d`.`apellido`,`d`.`telefono`,`v`.`nombre`,`v`.`apellido`,`c`.`motivo` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_tratamientos_mascotas`
--

/*!50001 DROP VIEW IF EXISTS `v_tratamientos_mascotas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_tratamientos_mascotas` AS select distinct `m`.`idmascotas` AS `idmascotas`,`m`.`nombre` AS `mascota_nombre`,concat(`d`.`nombre`,' ',`d`.`apellido`) AS `dueno_nombre`,`e`.`nombre` AS `especie_nombre` from (((`mascotas` `m` join `duenos` `d` on((`m`.`duenos_idduenos` = `d`.`idduenos`))) join `especies` `e` on((`m`.`especies_idespecies` = `e`.`idespecies`))) join `mascotas_has_tratamientos` `mht` on((`m`.`idmascotas` = `mht`.`mascotas_idmascotas`))) order by `m`.`nombre` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_veterinarios_info`
--

/*!50001 DROP VIEW IF EXISTS `v_veterinarios_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_veterinarios_info` AS select `v`.`idveterinarios` AS `idveterinarios`,`v`.`nombre` AS `nombre`,`v`.`apellido` AS `apellido`,`v`.`telefono` AS `telefono`,`v`.`email` AS `email`,group_concat(distinct `e`.`nombre` order by `e`.`nombre` ASC separator ', ') AS `especialidades`,group_concat(distinct `e`.`idespecialidad` separator ',') AS `especialidad_ids` from ((`veterinarios` `v` left join `veterinarios_has_especialidad` `ve` on((`v`.`idveterinarios` = `ve`.`veterinarios_idveterinarios`))) left join `especialidad` `e` on((`ve`.`especialidad_idespecialidad` = `e`.`idespecialidad`))) group by `v`.`idveterinarios` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_citas_completa`
--

/*!50001 DROP VIEW IF EXISTS `vista_citas_completa`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_citas_completa` AS select `c`.`idcitas` AS `idcitas`,`c`.`fecha` AS `fecha`,`c`.`hora` AS `hora`,`c`.`motivo` AS `motivo`,`c`.`estado` AS `estado`,`m`.`nombre` AS `mascota_nombre`,`m`.`peso` AS `mascota_peso`,`e`.`nombre` AS `especie`,`d`.`nombre` AS `dueno_nombre`,`d`.`apellido` AS `dueno_apellido`,`d`.`telefono` AS `dueno_telefono`,`v`.`nombre` AS `veterinario_nombre`,`v`.`apellido` AS `veterinario_apellido`,group_concat(distinct `esp`.`nombre` separator ', ') AS `especialidades` from ((((((`citas` `c` join `mascotas` `m` on((`c`.`mascotas_idmascotas` = `m`.`idmascotas`))) join `especies` `e` on((`m`.`especies_idespecies` = `e`.`idespecies`))) join `duenos` `d` on((`m`.`duenos_idduenos` = `d`.`idduenos`))) join `veterinarios` `v` on((`c`.`veterinarios_idveterinarios` = `v`.`idveterinarios`))) left join `veterinarios_has_especialidad` `ve` on((`v`.`idveterinarios` = `ve`.`veterinarios_idveterinarios`))) left join `especialidad` `esp` on((`ve`.`especialidad_idespecialidad` = `esp`.`idespecialidad`))) group by `c`.`idcitas`,`c`.`fecha`,`c`.`hora`,`c`.`motivo`,`c`.`estado`,`m`.`nombre`,`m`.`peso`,`e`.`nombre`,`d`.`nombre`,`d`.`apellido`,`d`.`telefono`,`v`.`nombre`,`v`.`apellido` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01 19:22:28
