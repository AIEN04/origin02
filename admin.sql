
CREATE TABLE IF NOT EXISTS `admins` (
`sid` int(11) NOT NULL,
`admin_id` varchar(255) NOT NULL,
`password` varchar(255) NOT NULL,
`created_at` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `admins`
ADD PRIMARY KEY (`sid`),
ADD UNIQUE KEY `admin_id` (`admin_id`);
ALTER TABLE `admins`
MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

INSERT INTO `admins` (`sid`, `admin_id`, `password`, `created_at`) VALUES
(1, 'root1', SHA1('123456'), NOW()),
(2, 'root2', SHA1('abc'),NOW())