SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



CREATE TABLE `jar_types` (
  `id` int(30) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `pricing` float NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `jar_types` (`id`, `name`, `description`, `pricing`, `date_created`, `date_updated`) VALUES
(1, 'Slim Container with cap and faucet', '<span style=\"color: rgb(0, 0, 0); font-family: \"Open Sans\", Arial, sans-serif; font-size: 14px; text-align: justify;\">Integer a risus enim. Mauris justo erat, tempus eu mauris sed, scelerisque tincidunt diam. Nam eget augue aliquam, commodo ligula consequat, maximus tellus. Suspendisse elit eros, pellentesque nec enim non, tincidunt pharetra magna. Vestibulum vel ex nunc. Nam semper diam et diam efficitur blandit. In ullamcorper dolor nec mauris vulputate, vel blandit purus elementum.</span>', 30, '2021-08-14 14:29:40', '2021-08-14 14:32:00'),
(2, 'Round Container with Cap', '<p><span style=\"color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; font-size: 14px; text-align: justify;\">Nunc a massa id ligula varius convallis in non augue. Sed feugiat blandit mattis. Mauris pulvinar fringilla tellus a accumsan. Nunc pharetra semper posuere. Ut rutrum odio at lectus maximus suscipit. Sed feugiat turpis a auctor malesuada. Integer ante quam, suscipit eu aliquet eget, ullamcorper ac justo. Maecenas nec orci non ipsum cursus pellentesque quis eget ligula. Nulla facilisi. Etiam tincidunt felis id maximus interdum. Curabitur non neque non sapien rhoncus tristique.</span><br></p>', 30, '2021-08-14 14:32:18', NULL);



CREATE TABLE `sales` (
  `id` int(30) NOT NULL,
  `customer_name` text NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = walk-in, 2 = for delivery',
  `delivery_address` text NOT NULL,
  `amount` float NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0= Unpaid, 1=Paid',
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `sales` (`id`, `customer_name`, `type`, `delivery_address`, `amount`, `status`, `date_created`, `date_updated`) VALUES
(1, 'John Smith', 1, '', 360, 1, '2021-08-14 15:41:36', '2021-08-14 15:50:29'),
(2, 'Claire Blake', 2, 'Sample Address', 150, 1, '2021-08-14 15:51:44', '2021-08-14 15:55:17');


CREATE TABLE `sales_items` (
  `id` int(30) NOT NULL,
  `sales_id` int(30) NOT NULL,
  `jar_type_id` int(30) NOT NULL,
  `quantity` float NOT NULL,
  `price` float NOT NULL,
  `total_amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `sales_items` (`id`, `sales_id`, `jar_type_id`, `quantity`, `price`, `total_amount`) VALUES
(3, 1, 1, 10, 30, 300),
(4, 1, 2, 2, 30, 60),
(7, 2, 2, 5, 30, 150);



CREATE TABLE `system_info` (
  `id` int(30) NOT NULL,
  `meta_field` text NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `system_info` (`id`, `meta_field`, `meta_value`) VALUES
(1, 'name', 'Simple Water Refilling Management System'),
(6, 'short_name', 'Water Refilling System - PHP'),
(11, 'logo', 'uploads/1628916900_water_refilling.png'),
(13, 'user_avatar', 'uploads/user_avatar.jpg'),
(14, 'cover', 'uploads/1626249540_dark-bg.jpg');



CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `firstname` varchar(250) NOT NULL,
  `lastname` varchar(250) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `avatar` text DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `password`, `avatar`, `last_login`, `type`, `date_added`, `date_updated`) VALUES
(1, 'Adminstrator', 'Admin', 'admin', '0192023a7bbd73250516f069df18b500', 'uploads/1624240500_avatar.png', NULL, 1, '2021-01-20 14:02:37', '2021-06-21 09:55:07');


ALTER TABLE `jar_types`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sales_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_id` (`sales_id`);

ALTER TABLE `system_info`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `jar_types`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


ALTER TABLE `sales`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `sales_items`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;


ALTER TABLE `system_info`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;


ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `sales_items`
  ADD CONSTRAINT `sales_items_ibfk_1` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;
COMMIT;
