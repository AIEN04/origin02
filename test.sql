CREATE TABLE IF NOT EXISTS `sales` (
`sid` int(11) NOT NULL,
`sales_id` varchar(255) NOT NULL,
`name` varchar(255) NOT NULL,
`birthday` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
INSERT INTO `sales` (`sid`, `sales_id`, `name`, `birthday`) VALUES
(1, 'A001', 'Jay', '1990-09-13'),
(2, 'B002', 'Jolin', '1989-01-10'),
(3, 'A002', 'Jerry', '1990-02-20');
ALTER TABLE `sales`
ADD PRIMARY KEY (`sid`),
ADD UNIQUE KEY `sales_id` (`sales_id`);
ALTER TABLE `sales`
MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;