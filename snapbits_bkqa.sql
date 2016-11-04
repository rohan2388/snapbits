-- phpMyAdmin SQL Dump
-- version 4.3.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 03, 2016 at 11:46 PM
-- Server version: 5.5.51-38.2
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `kbqaco_snapbits`
--

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL,
  `filename` text COLLATE utf8_unicode_ci,
  `path` text COLLATE utf8_unicode_ci,
  `hash` varchar(48) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `post` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `filename`, `path`, `hash`, `time`, `user`, `post`) VALUES
(1, 'cat-1508613_1280.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/hstebfsailhylod2vi.jpg', 'qVaLyNemU7sI5DJQzH8tfkvQ', '2016-07-17 23:35:53', 1, 1),
(2, 'popcorn-1433327_1280.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/t496t3zxr8onevf3ge.jpg', 'GN0SoOkD0rGcfaHpvI8siTsL', '2016-07-17 23:35:53', 1, 1),
(3, 'roe-deer-1482712_1280.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/47ighy17484hrr08wg.jpg', 'aBCwVbkvWnqzLYPRaMNFeLnb', '2016-07-17 23:35:53', 1, 1),
(4, 'Random File.txt', 'home/kbqaco/public_html/snapbits/uploads/txt/zozb4c3pec3cx8xscg.txt', 'flogzX-7jxvHbTvm90BRt4nf', '2016-07-17 23:35:53', 1, 1),
(5, 'anglo_american_logo.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/9nbrev7r9m6aw8amnx.jpg', 'wtFixI2apVDj4oaU8LXPqkQg', '2016-07-21 01:56:46', 1, 4),
(6, '38_Snapbits_Note-detail.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/eprlcaeehms4t6k092.jpg', 'zBvXq1lTQGYaRLCxL4oXSWj9', '2016-07-21 02:51:44', 1, 1),
(12, 'fake.txt', 'home/kbqaco/public_html/snapbits/uploads/txt/4ma1ora41ekj91euww.txt', 'UoMRu8EiPqHTr4kLGCmCWBKq', '2016-07-22 20:06:20', 1, 13),
(13, 'HF_Logo_GIF.gif', 'home/kbqaco/public_html/snapbits/uploads/gif/ort6r2i4nphxbn2ds7.gif', 'icg6J-6x7_iPJzSuxSLEAxTC', '2016-09-22 02:11:51', 12, 42),
(14, 'IMG_20160826_131840.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/2lujt645hr39latpkw.jpg', 'fg4Bj3FpW1Ne9lDCsZkNhs8O', '2016-09-22 02:34:02', 11, 43),
(15, 'image1.PNG', 'home/kbqaco/public_html/snapbits/uploads/PNG/ytpgqw81odba54kfsj.PNG', 'EQfUF5Z9AGXA8AO6Sl0GNbuz', '2016-09-22 04:06:40', 12, 42),
(16, 'Venue Image.png', 'home/kbqaco/public_html/snapbits/uploads/png/l9258mwqa6bjcgvwiz.png', 'QpQBG9rk36fArNEC9f0wwMD-', '2016-09-22 05:05:29', 12, 36),
(18, 'image.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/6zskheamtvfx8onbj7.jpg', '8-ZtQ8QcmlIaIFLY_-2cUHbw', '2016-09-23 01:59:10', 11, 47),
(19, 'Strawberry-Body-scrub-1-of-1-4.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/mzdw0h8nwe6gbkx6on.jpg', 'x1ZEFPutDM-_iu2IFWHfz6Ps', '2016-10-20 07:21:58', 5, 75),
(20, 'how-to-prune-rosebushes1.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/jqvydt4ijs0f2m7j1l.jpg', 'nCPI8JCW6iFzsWZjxX9FaRYf', '2016-10-20 07:29:31', 5, 76),
(21, 'image.jpg', 'home/kbqaco/public_html/snapbits/uploads/jpg/ttci58r240qybs0dof.jpg', 'IyjoQnmYH6w__JY9YgNycG8k', '2016-10-28 07:39:40', 26, 69);

-- --------------------------------------------------------

--
-- Table structure for table `metadata`
--

CREATE TABLE IF NOT EXISTS `metadata` (
  `id` int(11) NOT NULL,
  `type` text COLLATE utf8_unicode_ci,
  `value` text COLLATE utf8_unicode_ci,
  `time` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `metadata`
--

INSERT INTO `metadata` (`id`, `type`, `value`, `time`, `user`) VALUES
(29, 'pass_hint', 'Admin@123', '2016-08-22 01:11:34', 5),
(30, 'lockpass_hint', 'Rohan@123', '2016-08-22 01:12:17', 5),
(31, 'email2snapbit-email', 'rohan@gmail.com', '2016-08-22 01:12:34', 5),
(32, 'shared_twitter', 'yes', '2016-09-05 03:46:39', 7),
(33, 'shared_twitter', 'yes', '2016-09-20 05:56:40', 13),
(34, 'timezone', 'Africa/Algiers', '2016-09-26 07:37:32', 12),
(35, 'shared_twitter', 'yes', '2016-09-23 02:53:47', 19),
(36, 'shared_twitter', 'yes', '2016-09-23 05:09:06', 21),
(41, 'email-verification-hash', '70f1f7cdc7e4da9712712d929ff9da00b4981735', '2016-09-23 10:07:33', 24),
(42, 'email-verified', 'no', '2016-09-23 10:07:33', 24),
(43, 'lockpass_hint', 'my password plus !', '2016-09-26 05:49:53', 12),
(44, 'email-verification-hash', 'e77dccc3d3d5679e57d93020a2909234e2aa920a', '2016-09-26 06:15:36', 25),
(45, 'email-verified', 'no', '2016-09-26 06:15:36', 25),
(46, 'shared_email', 'yes', '2016-09-26 06:35:40', 25),
(47, 'shared_twitter', 'yes', '2016-09-26 06:37:35', 25),
(48, 'timezone', 'Africa/Johannesburg', '2016-09-26 07:18:42', 25),
(49, 'reminder-email', 'cesvdd@gmail.com', '2016-09-26 07:18:50', 25),
(50, 'reminder-email', 'cesvdd@gmail.com', '2016-09-26 07:19:52', 12),
(51, 'pass_hint', 'Casamir34!', '2016-09-26 07:36:03', 12),
(53, 'premium-end', '2016-10-27 06:26:21', '2016-09-27 06:27:04', 5),
(54, 'premium-type', 'paid', '2016-09-27 06:27:04', 5),
(55, 'reminder-email', 'rohan23dec@gmail.com', '2016-09-28 16:09:02', 5),
(56, 'reminder-email', 'rohan_23dec@yahoo.com', '2016-09-28 16:09:11', 5),
(57, 'email2snapbit-email', 'rohan23dec@gmail.com', '2016-09-30 02:24:43', 5),
(58, 'email-verification-hash', 'ab74641faa04c7b85ffb1e44d7c1d943d6590fa8', '2016-10-03 07:21:13', 26),
(59, 'email-verified', 'no', '2016-10-03 07:21:13', 26),
(60, 'email-verification-hash', '8a03fdc675b23922c4da4d11cf41d5138150585b', '2016-10-20 07:11:56', 27),
(61, 'email-verified', 'no', '2016-10-20 07:11:56', 27),
(62, 'email-verification-hash', 'ce2a0239a61fad6567383695cc5008781676b3bf', '2016-10-24 06:20:06', 28),
(63, 'email-verified', 'no', '2016-10-24 06:20:06', 28),
(64, 'lockpass_hint', 'Help me remember?', '2016-10-24 06:20:42', 28),
(65, 'email-verification-hash', '5f06ca223c4e89c907981a2cbea3f0e273e8e981', '2016-10-24 09:34:25', 29),
(66, 'email-verified', 'yes', '2016-10-24 09:34:25', 29),
(67, 'email2snapbit-email', 'corneile@mac.com', '2016-10-24 09:35:35', 29),
(68, 'email-verification-hash', '483f36adf63a36fcd24bae68ae9a7e6e24eccaad', '2016-10-28 07:15:19', 30),
(69, 'email-verified', 'no', '2016-10-28 07:15:19', 30);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL,
  `title` text COLLATE utf8_unicode_ci,
  `content` longtext COLLATE utf8_unicode_ci,
  `time` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `lock` tinyint(1) DEFAULT NULL,
  `color` text COLLATE utf8_unicode_ci,
  `reminder` text COLLATE utf8_unicode_ci,
  `notify_on` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `time`, `user`, `lock`, `color`, `reminder`, `notify_on`) VALUES
(1, 'This is real db post', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Test test....', '2016-07-17 23:35:53', 1, 1, '5dd8a0', NULL, NULL),
(2, 'Quick note', 'You can now add and delete bits. I am currently working on edit and saving already existing posts. Only .jpg, .gif, .png, .doc, .txt and .dot files are supported. Voice recorder won''t work on insecure (http) url .', '2016-07-17 23:43:43', 1, 0, '5dd8a0', NULL, NULL),
(3, 'Update: July 18', 'Changelog:\r\n1. View full post\r\n2. Fix few bus', '2016-07-18 18:19:24', 1, 0, 'ff9100', NULL, NULL),
(4, 'Update: July 20', 'Changelog:\r\n1. Edit and save old posts\r\n2. Fixed few animation bugs\r\n2. Improved performance	\r\n\r\nNext Step:\r\n1. Pagination\r\n2. Implement post search', '2016-07-20 20:39:33', 1, 1, 'fe4556', NULL, NULL),
(12, 'Update: July 22', 'Changelog:\r\n1. Pagination added (10 posts per page)\r\n2. Post filtering added\r\n3. Timeline will auto-update after editing a post \r\n\r\nNext step:\r\n1. Reminder email\r\n2. Load tags from db n search options', '2016-07-22 20:05:37', 1, 0, '58a8e1', NULL, NULL),
(13, 'Testing document upload', 'Progressively synthesize competitive manufactured products rather than technically sound initiatives. Uniquely network go forward e-tailers without resource-leveling expertise. Compellingly reinvent leveraged web services via best-of-breed deliverables. Appropriately visualize excellent synergy after equity invested web services. Proactively transform e-business applications and next-generation supply chains.\r\n\r\nObjectively deploy visionary best practices with turnkey expertise. Credibly pontificate web-enabled paradigms without installed base best practices. Professionally network leveraged total linkage whereas fully tested customer service. Appropriately enhance cross-media leadership skills after superior services. Quickly create standardized imperatives for one-to-one leadership.', '2016-07-22 20:06:20', 1, 0, 'none', '{"time":"","reminder":""}', NULL),
(14, 'Update: July 26', 'Changelog:\r\n1. Edit button functional\r\n2. Auto remove group if empty\r\n3. Reminder setup\r\n4. Show real tags in search options\r\n5. Added button to open composer area when viewing a post\r\n6. Added upload progress bar when saving post\r\n7. Bug fixes.\r\n\r\nNext step:\r\n1. Setup user authorization\r\n2. Locked bit support', '2016-07-26 22:53:59', 1, 0, 'ff9100', '{"time":"","reminder":""}', NULL),
(15, 'Update: Aug 1', 'Changelog:\r\n1. Added login system\r\n2. Registration system implemented (disabled)\r\n3. Landing page will be shown to new users\r\n\r\nNext step:\r\n1. Premium membership\r\n2. Social share\r\n\r\nRegistration system will be enabled once premium membership is ready.', '2016-08-01 23:16:54', 1, 0, '5dd8a0', NULL, NULL),
(16, 'Heading', 'add a heading', '2016-08-24 03:29:58', 6, 0, NULL, NULL, NULL),
(17, 'Energistically create revolutionary', 'Energistically create revolutionary potentialities via bricks-and-clicks strategic theme areas. Compellingly network e-business e-commerce through interdependent customer service. Seamlessly benchmark state of the art web services before state of the art vortals. Enthusiastically restore impactful sources through progressive deliverables. Monotonectally network cross-platform imperatives.', '2016-08-29 06:28:47', 5, 0, 'fe4556', '{"time":"","reminder":""}', NULL),
(19, 'My heading here', 'Lorem ipsum dolor sit amet, ne cum apeirian senserit. Nullam evertitur adipiscing usu eu, ut tale mucius lobortis vim. Est no choro lobortis, has at recusabo deterruisset. Consul vivendo adipisci an ius.\r\n\r\nSea ea brute harum posidonium, vel ei summo elitr putent. An vis discere efficiantur, ea duo cibo scribentur. Ei eam periculis reformidans, mei ei eirmod reprimique. Nec nobis aperiri corrumpit ex, agam concludaturque id eam. Ei sed iriure detraxit gubergren. His debet constituto ne.', '2016-09-05 03:40:34', 8, 0, 'ff9100', NULL, NULL),
(21, 'Iprxotc4xog', 'Jvudtvyvyc5d', '2016-09-20 02:47:44', 11, 0, NULL, NULL, NULL),
(24, 'My first bit :)', 'I am happy now that I am able to add bits and finally store information which I always previously forgot. I am now adding more information.', '2016-09-20 05:58:21', 13, 0, '58a8e1', '{"time":"","reminder":""}', NULL),
(26, 'dghdfgh', 'hfdfhdfh', '2016-09-21 07:43:56', 12, 0, NULL, NULL, NULL),
(27, 'hffhm', 'fgmfmgf', '2016-09-21 07:44:13', 12, 0, NULL, NULL, NULL),
(31, 'Hfdjgd', 'Jgmghf', '2016-09-21 07:48:57', 12, 0, 'ffce00', NULL, NULL),
(32, 'Sitisgisti', 'Dyksgsitz', '2016-09-21 07:53:00', 12, 0, NULL, NULL, NULL),
(33, 'HFjafjatsfksgkst', 'Sgmsgks', '2016-09-21 07:53:38', 12, 0, NULL, NULL, NULL),
(34, 'Fddgf', 'Rtrrrrrr', '2016-09-21 07:54:04', 12, 0, NULL, NULL, NULL),
(36, 'sfsdg', 'sdgsdgsdg', '2016-09-21 07:59:18', 12, 0, '5dd8a0', '{"time":"","reminder":""}', NULL),
(37, '$;''_-;', 'Kgdkgdhd', '2016-09-22 01:43:45', 11, 0, NULL, NULL, NULL),
(38, 'Hsnauav', 'Mzjabdbz', '2016-09-22 01:44:20', 11, 0, NULL, NULL, NULL),
(39, 'Fcbhfx', 'Gvnyd', '2016-09-22 01:52:38', 11, 0, NULL, NULL, NULL),
(40, 'Ysgsyyxx', 'Gssdthd', '2016-09-22 01:53:29', 11, 0, NULL, NULL, NULL),
(42, 'Gif', 'Gif', '2016-09-22 02:11:51', 12, 0, 'none', '{"time":"22\\/09\\/2016 09:02","reminder":"on-time"}', 2016),
(43, 'Vjgc', 'Bctg', '2016-09-22 02:34:02', 11, 1, '5dd8a0', NULL, NULL),
(44, 'Bskdusn', 'Nxjxbd', '2016-09-22 04:37:08', 11, 0, NULL, NULL, NULL),
(45, 'Bsnu', 'Bxnzue', '2016-09-23 01:50:11', 12, 0, 'none', '{"time":"","reminder":""}', NULL),
(47, 'Gcd', 'Bbc', '2016-09-23 01:59:10', 11, 0, NULL, NULL, NULL),
(48, 'Bchv', 'Vvg', '2016-09-23 01:59:16', 12, 0, 'none', '{"time":"","reminder":""}', NULL),
(49, 'Gdxf', 'Chd', '2016-09-23 02:01:21', 11, 0, NULL, NULL, NULL),
(50, 'Bit 1 Heading', 'This is my first snappy bit test.', '2016-09-23 05:15:08', 21, 0, '5dd8a0', NULL, NULL),
(54, 'asfasg', 'asgasgas', '2016-09-26 05:36:56', 12, 0, NULL, NULL, NULL),
(55, 'safasf', 'asfasf', '2016-09-26 05:37:13', 12, 0, NULL, NULL, NULL),
(56, 'rnr', 'nrnr', '2016-09-26 05:37:23', 12, 0, NULL, NULL, NULL),
(57, 'hfgdhc', 'nvc', '2016-09-26 05:43:54', 12, 1, NULL, NULL, NULL),
(58, 'ev', 'dvdvdv', '2016-09-26 06:44:44', 25, 0, '5dd8a0', '{"time":"","reminder":""}', NULL),
(59, 'gfhg', 'gj', '2016-09-26 07:20:40', 12, 0, NULL, '{"time":"26\\/09\\/2016 14:23","reminder":"on-time"}', 2016),
(60, 'Jfjsi', 'Nsj', '2016-09-26 08:00:10', 12, 0, NULL, NULL, NULL),
(61, 'Reminder test', 'Rapidiously disintermediate collaborative infomediaries and synergistic relationships. Authoritatively parallel task dynamic materials vis-a-vis progressive interfaces. Monotonectally create team driven.', '2016-09-28 16:09:48', 5, 0, 'none', '{"time":"29\\/09\\/2016 14:45","reminder":"on-time"}', 0),
(66, 'Email to snapbits', 'Holisticly aggregate distinctive total linkage after reliable\npotentialities. Dramatically reintermediate business scenarios through\nempowered platforms. Phosfluorescently optimize robust outsourcing.', '2016-09-30 03:09:25', 5, 0, NULL, NULL, NULL),
(67, 'Hahaha classic comedy', 'Shicracky', '2016-10-03 04:56:37', 11, 0, NULL, NULL, NULL),
(68, 'sfsvsbsds', 'hhvgvjvf', '2016-10-03 06:22:09', 11, 0, 'ffce00', '{"time":"","reminder":""}', NULL),
(69, 'Nelius''s Muse', '\\m/ (0_o) \\m/ gfhghh', '2016-10-03 07:23:39', 26, 1, 'fe4556', '{"time":"","reminder":""}', NULL),
(73, 'dfgdfg', 'dfgdf', '2016-10-05 07:15:35', 26, 0, 'none', '{"time":"","reminder":""}', NULL),
(74, 'fgsf', 'sdhsh', '2016-10-05 07:16:49', 26, 0, NULL, NULL, NULL),
(75, 'Strawberry coconut body scrub', 'In a medium bowl combine sugar and dried strawberry powder, mix until combined. Once combine add coconut oil, essential oil and miracle glow oil to the bowl. Stir all ingredients with hand or spoon, until mixed. Once mixed add to a medium container and store.', '2016-10-20 07:21:58', 5, 0, 'fe4556', '{"time":"","reminder":""}', NULL),
(76, 'Time to prune the roses!', 'The most suitable time to trim rose bushes starts when most of the leaves fall from the bushes and roses are undergone hoarfrost.\r\nBefore trimming, the first thing you must do is to remove grass and leaves from the base of flowers. It is necessary because insects and diseases hide in moist environment so removing trash and waste becomes very important to ensure that diseases and insects are not causing harm to rose bushes.\r\nNext step is to remove the damaged and diseased branches by cutting the whole stem. Then remove old branches.\r\nBefore proceeding further, make sure that those branches are removed that are crossed over main stem of the rose bushes.\r\nNow start trimming the bush by cutting weak and thin branches. This is necessary to make the nutrients available for the central and major stem. This will also provide more light to the stem and healthy branches.\r\nThe green sprouts should also be removed that grow off the central stem. Other weeds and suckers should also be cut down that grow from the roots of rose bush.\r\nWhile pruning the rose bush, use sharp shears to avoid rough and uneven cuts. If care is not taken then rose bush may become infected with some disease.\r\nThe method of trimming is very simple. Try to trim to a healthy bud by making the cut at 45 degree angle.\r\nAlso cut the leaves that point towards outside of the rose bush.\r\nNow there should be some treatment of the open wound. The method is to paint the wound with a sealing mixture to prevent the rose bush from infections and diseases.\r\nAbove mentioned instructions are quite reliable to be used for trimming your rose bush in a better way.', '2016-10-20 07:28:41', 5, 0, '5dd8a0', '{"time":"27\\/10\\/2016 14:10","reminder":"on-time"}', 1477570200),
(77, 'Psychology 101: Stages of Sleep', 'Class notes: 20 Oct 2016\r\n\r\nDuring the earliest phases of sleep, you are still relatively awake and alert. The brain produces what are known as beta waves, which are small and fast.\r\n\r\nAs the brain begins to relax and slow down, slower waves known as alpha waves are produced. During this time when you are not quite asleep, you may experience strange and extremely vivid sensations known as hypnagogic hallucinations. Common examples of this phenomenon include feeling like you are falling or hearing someone call your name.\r\n\r\nAnother very common event during this period is known as a myoclonic jerk. If you have ever startled suddenly for seemingly no reason at all, then you have experienced this phenomenon. While it might seem unusual, these myoclonic jerks are actually quite common.', '2016-10-20 07:49:21', 5, 0, 'ffce00', '{"time":"","reminder":""}', NULL),
(78, 'Dear Diary', 'I am passionate about sharing the benefits and positive effects journaling and daily planning has to help reach one''s life goals, personal visions, and creative passions.\r\n\r\nFrom time to time, I also share personal thoughts on self discovery through art and life experiences, while living a minimalist lifestyle to help support my joy and interest for world travels.', '2016-10-20 07:57:13', 5, 1, NULL, '{"time":"27\\/10\\/2016 14:10","reminder":"on-time"}', 1477570200),
(79, 'My first bit :) - Edited', 'I make a bit and it is very nice and pretty and this is a cool textarea which makes me think that I am writing.', '2016-10-24 06:21:58', 28, 0, '58a8e1', '{"time":"","reminder":""}', NULL),
(80, 'My second bit ;)', 'I am now happy to add my second bit in a snappy manner.', '2016-10-27 02:30:29', 28, 0, 'fe4556', '{"time":"","reminder":""}', NULL),
(81, 'Test 1', 'Test 1', '2016-10-28 07:19:15', 30, 0, 'fe4556', '{"time":"","reminder":""}', NULL),
(83, 'Test', 'Test', '2016-10-28 07:36:44', 26, 1, 'ffce00', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts__tags_mm_tags__posts`
--

CREATE TABLE IF NOT EXISTS `posts__tags_mm_tags__posts` (
  `id` int(11) NOT NULL,
  `posts` text NOT NULL,
  `tags` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts__tags_mm_tags__posts`
--

INSERT INTO `posts__tags_mm_tags__posts` (`id`, `posts`, `tags`) VALUES
(3, '2', 3),
(4, '2', 4),
(9, '3', 3),
(10, '3', 5),
(13, '4', 3),
(14, '4', 5),
(37, '12', 3),
(38, '12', 5),
(39, '1', 1),
(40, '1', 2),
(41, '1', 9),
(44, '14', 3),
(45, '14', 5),
(46, '15', 3),
(47, '15', 5),
(48, '16', 10),
(57, '19', 14),
(73, '24', 20),
(74, '24', 21),
(75, '24', 22),
(82, '17', 11),
(83, '17', 12),
(91, '47', 27),
(92, '50', 28),
(93, '50', 29),
(94, '50', 30),
(97, '54', 33),
(98, '55', 34),
(99, '55', 35),
(100, '56', 33),
(101, '56', 36),
(103, '58', 37),
(104, '59', 38),
(106, '68', 39),
(112, '73', 42),
(113, '73', 43),
(114, '74', 42),
(115, '74', 43),
(117, '75', 44),
(119, '76', 45),
(124, '78', 48),
(131, '77', 46),
(132, '77', 47),
(134, '79', 49),
(135, '79', 50),
(136, '79', 51),
(148, '80', 52);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(40) NOT NULL,
  `data` text,
  `ip` varchar(40) DEFAULT NULL,
  `agent` varchar(255) DEFAULT NULL,
  `stamp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `data`, `ip`, `agent`, `stamp`) VALUES
('00aec59e9a2ea3d51f1fac94cb9e3782', 'csrf|s:27:"3vg5nin244is4.23fnrikmnizo4";', '192.185.24.133', '', 1478192411),
('012b66f22c46db7b9b7ca0a976fce13f', 'csrf|s:27:"3vg5nin244is4.2ywvl0kyx5gk4";', '192.185.24.133', '', 1478130662),
('0178ffbba384d7ebcecf2875bf74e30a', 'csrf|s:27:"3vg5nin244is4.1rgf8n139u5xm";', '192.185.24.133', '', 1478201641),
('033b278e350de208ee66bc2855deb12e', 'csrf|s:26:"3vg5nin244is4.8ijn8u61tgy7";', '192.185.24.133', '', 1478092622),
('04e0f7b721b605856fa4b15b3112f60e', 'csrf|s:27:"3vg5nin244is4.136ryirefmcpg";', '192.185.24.133', '', 1478152806),
('050dbe0bd6a826ba8d06d992fa7ba5d4', 'csrf|s:26:"3vg5nin244is4.vj2p96eeqjlm";', '192.185.24.133', '', 1478158441),
('07f067bcf5698a766220d11466cbaf4b', 'csrf|s:27:"3vg5nin244is4.1aq2h3hzcsco5";', '47.30.159.121', 'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G925I Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36', 1478083001),
('08069e17b292eda709a7b14be355c4f1', 'csrf|s:27:"3vg5nin244is4.1cjkwh3kwsscn";', '192.185.24.133', '', 1478213461),
('0982d6529415d4b149e2fbb7d6f8a4d7', 'csrf|s:27:"3vg5nin244is4.20sdbb5ij0bow";', '192.185.24.133', '', 1478179022),
('0c8829eb184f124dc35a2d9d72fbf8d4', 'csrf|s:27:"3vg5nin244is4.35m12mwlxwo4s";', '192.185.24.133', '', 1478169241),
('0ec2d44672d709244b5db190c209b9b7', 'csrf|s:26:"3vg5nin244is4.7edgxq8nmoap";', '192.185.24.133', '', 1478141463),
('10835b691fed61a5a4ec9a77659289f1', 'csrf|s:26:"3vg5nin244is4.pmotq4j76mw4";', '192.185.24.133', '', 1478072042),
('13e99ff537cb83c00c9949363dbefc1d', 'csrf|s:27:"3vg5nin244is4.2jx9zftk6668o";', '47.30.159.121', 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; SM-G925I Build/MMB29K)', 1478093489),
('1612f83614eff3b3825565e21bcbc3e4', 'csrf|s:27:"3vg5nin244is4.3b6nnj3177y8g";', '192.185.24.133', '', 1478111642),
('16788e2d331cb2487663bdf164265189', 'csrf|s:27:"3vg5nin244is4.28g0sc2402zog";', '192.185.24.133', '', 1478083864),
('16d0c377d11d415b49aa5a18d32047b2', 'csrf|s:26:"3vg5nin244is4.55mmwy9yr1mg";', '192.185.24.133', '', 1478206261),
('1a1e766c5327964ad35953eaa3c50f1f', 'csrf|s:27:"3vg5nin244is4.22b8xu8t1hfoc";', '192.185.24.133', '', 1478100842),
('1c1399b9e5216b67904856f1ded47de5', 'csrf|s:27:"3vg5nin244is4.1dm8yfibllsxj";', '47.30.159.121', 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; SM-G925I Build/MMB29K)', 1478083002),
('1ed4a3e6b8475b813616134dc535d477', 'csrf|s:27:"3vg5nin244is4.1eykxd5j6edu9";', '192.185.24.133', '', 1478126041),
('21fda4de88ba5e6b5f188b1a275a757f', 'csrf|s:26:"3vg5nin244is4.rvk21ilg37ir";', '192.185.24.133', '', 1478186222),
('223a2d51afc1857a7f0ae7af3350e307', 'csrf|s:27:"3vg5nin244is4.1rdu5i7952eit";', '192.185.24.133', '', 1478086443),
('2438e0d9f260a8c7bca8622138f8de00', 'csrf|s:27:"3vg5nin244is4.1i6e0b3asuike";', '192.185.24.133', '', 1478115241),
('25e44c3dbce5e02343f6319c75ec4dcc', 'csrf|s:27:"3vg5nin244is4.3cg7ucltizac0";', '192.185.24.133', '', 1478118841),
('2669823c7aaf80268ebb96611c41943f', 'csrf|s:27:"3vg5nin244is4.3qgoeif5u0e8s";', '192.185.24.133', '', 1478084404),
('2934fb7314c24f1ac62e095272bbdf00', 'csrf|s:27:"3vg5nin244is4.3oy6cg4vzsu84";', '192.185.24.133', '', 1478181605),
('2987a46e00b7c80e8faa3d9668cde051', 'csrf|s:27:"3vg5nin244is4.2cv2ablujnk00";', '192.185.24.133', '', 1478216042),
('2a758d6b71e02b3912c14d939472a141', 'csrf|s:27:"3vg5nin244is4.3b34s2lu97i8w";', '192.185.24.133', '', 1478191862),
('2d50644da878d2806eadd4091259b152', 'csrf|s:27:"3vg5nin244is4.1ufadmprggaix";', '192.185.24.133', '', 1478131203),
('2e82354ddf178136f5a4a1d74e8fe4c7', 'csrf|s:27:"3vg5nin244is4.2j12qa53x484s";', '192.185.24.133', '', 1478159462),
('2f8d927dc9b2acc47cbcdc820b79ca92', 'csrf|s:27:"3vg5nin244is4.2kalgpizfwmc4";', '192.185.24.133', '', 1478221205),
('32590a7fe080086fa5a18ffc60d9fd58', 'csrf|s:26:"3vg5nin244is4.sakop652k4r6";', '192.185.24.133', '', 1478075642),
('327c9d35a16daf5713affc442d8754bf', 'csrf|s:27:"3vg5nin244is4.1eh9h3a6wc8cn";', '192.185.24.133', '', 1478112661),
('332c2f6f733622c0f41491777066bb59', 'csrf|s:26:"3vg5nin244is4.xr3sk3kd5amm";', '192.185.24.133', '', 1478116804),
('33f8da4e077c4cf9d7d5d74490c7d263', 'csrf|s:26:"3vg5nin244is4.2w84g4jf91wc";', '192.185.24.133', '', 1478224804),
('340f6d2e6a3eddd8b80026b405d767b0', 'csrf|s:27:"3vg5nin244is4.2tkmczq6dmas0";', '192.185.24.133', '', 1478223242),
('342ddaec24f64f907068dbf4f48543ea', 'csrf|s:27:"3vg5nin244is4.1ips7l7hvjd5z";', '192.185.24.133', '', 1478195461),
('3481ba7d36a8c8fff4a13aba5b9ec44e', 'csrf|s:27:"3vg5nin244is4.3cdia2hrda0wk";', '192.185.24.133', '', 1478134262),
('34991325518c164b8e564c3a1e60cfb5', 'csrf|s:27:"3vg5nin244is4.37p834tjueyow";', '192.185.24.133', '', 1478190842),
('3a880dae0e136a8487e5f1932dbab26e', 'csrf|s:27:"3vg5nin244is4.23na2nhxfozog";', '192.185.24.133', '', 1478080263),
('3b024039d74066e2b63911fa69df8023', 'csrf|s:26:"3vg5nin244is4.6v7zs120ukrv";', '192.185.24.133', '', 1478188803),
('3b105887f634e3f8dfd6ae804df3fe90', 'csrf|s:27:"3vg5nin244is4.3ceb5ziw65gkk";', '192.185.24.133', '', 1478098803),
('3fee236c2bcd6e0aa4b42a38e5806602', 'csrf|s:27:"3vg5nin244is4.23sasvdm45gks";', '192.185.24.133', '', 1478168222),
('40f58694f45efd8908cf5fd998d37197', 'csrf|s:27:"3vg5nin244is4.1khw8mvyihakx";', '192.185.24.133', '', 1478212442),
('4266a9d02ac36306475851fdc19ce474', 'csrf|s:27:"3vg5nin244is4.276yodwbf45c4";', '192.185.24.133', '', 1478103422),
('4375eb789aa4112173d4e5e18515e48a', 'csrf|s:27:"3vg5nin244is4.2g4i1c0ehcsgg";', '192.185.24.133', '', 1478196005),
('45e2748ef90a8f5304866388b129d726', 'csrf|s:27:"3vg5nin244is4.3jrhchpm5740c";', '192.185.24.133', '', 1478160003),
('4691fc09e61db2c548c0289ba2ed3f0e', 'csrf|s:27:"3vg5nin244is4.3qgd265mepc04";', '192.185.24.133', '', 1478135823),
('481f1348e416d0c7e9542be69e743aa2', 'csrf|s:27:"3vg5nin244is4.12b3tjl9ugfmo";', '192.185.24.133', '', 1478114224),
('4a424cfff2820fcc360ef4536b3d0a8d', 'csrf|s:27:"3vg5nin244is4.2ny1jfbw8h6og";', '192.185.24.133', '', 1478156406),
('4dd5570ffd988ecaf17522a73641e5bb', 'csrf|s:27:"3vg5nin244is4.3dmbmzc5srok0";', '192.185.24.133', '', 1478080804),
('4e81e24c55040f295883e95e6f45eaf0', 'csrf|s:27:"3vg5nin244is4.2gs8zucnj0004";', '192.185.24.133', '', 1478218621),
('5086c520c2f1dbf92de059efd8bfcf9e', 'csrf|s:27:"3vg5nin244is4.3935141q4wows";', '192.185.24.133', '', 1478120410),
('50df961efc807f6d7275f209436645e6', 'csrf|s:27:"3vg5nin244is4.3arung52j0w0c";', '192.185.24.133', '', 1478205242),
('5324827eee9e1f0f3aed2385fec56435', 'csrf|s:27:"3vg5nin244is4.1rq0pebz3c5sl";', '192.185.24.133', '', 1478127061),
('5375cd43544070f32418210bffc628ed', 'csrf|s:26:"3vg5nin244is4.g4akvl09olmo";', '192.185.24.133', '', 1478133241),
('53d456efc75f4a2bce9ef31fa2405c3b', 'csrf|s:27:"3vg5nin244is4.3trbnu0kutog4";', '192.185.24.133', '', 1478170261),
('547deab960601f49f8cc2691eadbd6b4', 'csrf|s:27:"3vg5nin244is4.1s66a7ypwmgr1";', '192.185.24.133', '', 1478145602),
('571c29f0ceb8e52965479230f52625e2', 'csrf|s:27:"3vg5nin244is4.275bdulsen40s";', '192.185.24.133', '', 1478222222),
('5a403292afd372a23319a3ffcf5036da', 'csrf|s:27:"3vg5nin244is4.1lmheurqpykfi";', '192.185.24.133', '', 1478117822),
('5b1a5ff64cddbf2927523af1de56ed61', 'csrf|s:27:"3vg5nin244is4.31bxnb62niuck";', '192.185.24.133', '', 1478217062),
('5be6b9cf3e51afa8776ee1b0c4c0671d', 'csrf|s:27:"3vg5nin244is4.1y1fylddezvve";', '192.185.24.133', '', 1478200622),
('5c15f06e348517554a43a62623f9c34a', 'csrf|s:26:"3vg5nin244is4.642jq6hut424";', '192.185.24.133', '', 1478234042),
('5d46646367e9a4bd11d928ae90f403ec', 'csrf|s:26:"3vg5nin244is4.r10owtlzm4tx";', '192.185.24.133', '', 1478110622),
('602631b212121cf484d27e48e6e3ec0f', 'csrf|s:27:"3vg5nin244is4.1fd1cvpw7kfbi";', '192.185.24.133', '', 1478182624),
('639d7c8b66da2b323a7218d8ab68db1a', 'csrf|s:27:"3vg5nin244is4.19nerhl9feced";', '192.185.24.133', '', 1478224261),
('648c62ac00f4acd9c6b96aad99d18511', 'csrf|s:26:"3vg5nin244is4.5hpqcyf9g028";', '66.249.65.47', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 1478074115),
('652aa304f658160f52ac15de1c422134', 'csrf|s:27:"3vg5nin244is4.2kiue3iuulc08";', '192.185.24.133', '', 1478185204),
('65fe252f93a2a6c5a0c004372392928d', 'csrf|s:26:"3vg5nin244is4.rt9s7992mkc0";', '192.185.24.133', '', 1478215021),
('66799293972cb1a5f6fa71857206a05e', 'csrf|s:26:"3vg5nin244is4.d2smewg3b8kr";', '192.185.24.133', '', 1478107025),
('66e6edcc922bb2a6bcb334e123fb6867', 'csrf|s:27:"3vg5nin244is4.2l54v13osl6ow";', '192.185.24.133', '', 1478121422),
('67963b0b366f201fa19b61ec5542115e', 'csrf|s:27:"3vg5nin244is4.1id5sd9tuvbl4";', '47.30.159.121', 'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G925I Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36', 1478093488),
('687abe277aecfd531c7b64f70c7c566e', 'csrf|s:26:"3vg5nin244is4.wgdfmjvfa5c2";', '192.185.24.133', '', 1478214003),
('68b5e990e5a537df19727cab82ea3321', 'csrf|s:27:"3vg5nin244is4.3lovosbbtyqs0";', '192.185.24.133', '', 1478137862),
('699ce734bafa057277f1eabc9ba0155b', 'csrf|s:27:"3vg5nin244is4.3iv2myf83logs";', '192.185.24.133', '', 1478231462),
('69ff0010999c31c12bdb0e83389f3b1c', 'csrf|s:26:"3vg5nin244is4.42g73u8ctsnm";', '192.185.24.133', '', 1478142003),
('6a1fd859d2a47a8952ae906a9eb2a8c4', 'csrf|s:27:"3vg5nin244is4.12479rz7paown";', '192.185.24.133', '', 1478104442),
('6a47d8ca00b3c6cf7caaca7c7817ab95', 'csrf|s:27:"3vg5nin244is4.1p1bo0ihjop02";', '192.185.24.133', '', 1478113203),
('6ce1f460398153b3670a8f8afe89d87d', 'csrf|s:26:"3vg5nin244is4.esig9t895935";', '192.185.24.133', '', 1478124004),
('6e12d80538fa7bce5225a91cc6e3f93d', 'csrf|s:27:"3vg5nin244is4.1dphziwdulyon";', '192.185.24.133', '', 1478074621),
('6e4d451304e158a714e77bb16d772d7e', 'csrf|s:27:"3vg5nin244is4.1cxzx6c6d84bn";', '192.185.24.133', '', 1478188262),
('6e5d25d96daa2263789e78dcea7f0350', 'csrf|s:27:"3vg5nin244is4.3tza0nrbr88w8";', '192.185.24.133', '', 1478173862),
('6e7b8fed9d1ce2d6d3044469a3200d99', 'csrf|s:26:"3vg5nin244is4.l7ut038qysgo";', '192.185.24.133', '', 1478094662),
('6f5e5eb74dfa17338c4b3b9511fb18c2', 'csrf|s:26:"3vg5nin244is4.lsesprkgqdmz";', '47.30.159.121', 'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G925I Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36', 1478091662),
('709f10d8ad85ea3593d8d65d50701e80', 'csrf|s:27:"3vg5nin244is4.2der4poffyhwc";', '192.185.24.133', '', 1478163062),
('7326b5a0ddd82e3a6bbaf708df2aad03', 'csrf|s:26:"3vg5nin244is4.doh3y9ds8xj4";', '192.185.24.133', '', 1478210403),
('73d90913e7c04e62ac8a32333aa3f991', 'csrf|s:27:"3vg5nin244is4.1e8bvv0cdkhjh";', '192.185.24.133', '', 1478226842),
('74679a882fe3e96ace726136f7698946', 'csrf|s:27:"3vg5nin244is4.1txnn1lzwx3j4";', '192.185.24.133', '', 1478101862),
('76502275d1b7ae47c67fc081e5f49b53', 'csrf|s:26:"3vg5nin244is4.dlsxew1awbg4";', '192.185.24.133', '', 1478097242),
('769b2639c7304b857e7fca74556c59a8', 'csrf|s:27:"3vg5nin244is4.1hu5kokkv6kbp";', '192.185.24.133', '', 1478170804),
('76b8e5f9e769ce2f2dea8cd01bec79fa', 'csrf|s:27:"3vg5nin244is4.2bf9eyk9pujo4";', '192.185.24.133', '', 1478134803),
('789134b44307558bcbac36af596546c2', 'csrf|s:27:"3vg5nin244is4.2mf1puymw7eo8";', '192.185.24.133', '', 1478076663),
('78ff10f3a0c195e779afee3e50e6224c', 'csrf|s:26:"3vg5nin244is4.qbqmcxr02opd";', '192.185.24.133', '', 1478085422),
('7b00c9083d715b55532d73d37dff8305', 'csrf|s:27:"3vg5nin244is4.3gc8rwhtgrc4c";', '192.185.24.133', '', 1478082842),
('7ec4f2c08042d3c286981e9d37a81bc4', 'csrf|s:27:"3vg5nin244is4.1oabmm9jjjzpt";', '192.185.24.133', '', 1478129641),
('7fb0e0ff193fa87b17bbeab130284a22', 'csrf|s:27:"3vg5nin244is4.1sy9tsbosehvp";', '192.185.24.133', '', 1478184662),
('7fe3e73e31417e8c6645c93c92070f0d', 'csrf|s:27:"3vg5nin244is4.2j0i4ml5dwiso";', '192.185.24.133', '', 1478178003),
('826019e84ee1cc7ba4ab176db14c01d4', 'csrf|s:27:"3vg5nin244is4.3driv6h6xvcwk";', '192.185.24.133', '', 1478180041),
('839f7a0c308d8a89afe8381320e21572', 'csrf|s:27:"3vg5nin244is4.13cc770vuwxq1";', '192.185.24.133', '', 1478078222),
('87ce6c419b3d1115837936b954355994', 'csrf|s:27:"3vg5nin244is4.2824ymkc4s2sk";', '192.185.24.133', '', 1478193422),
('8ce7484d6048e712f8bf4f8f74a1eca2', 'csrf|s:27:"3vg5nin244is4.15jn9l8xoubzx";', '192.185.24.133', '', 1478229422),
('8ee44db1771ac980190b851ebab0b9a5', 'csrf|s:26:"3vg5nin244is4.dcn22zx21jxr";', '192.185.24.133', '', 1478153822),
('900a8d303deea9a6d1fbb41aa73a373b', 'csrf|s:27:"3vg5nin244is4.35enaa3a3h44c";', '192.185.24.133', '', 1478199062),
('90b7aaee62ecaa1155f0f5dded753fc4', 'csrf|s:27:"3vg5nin244is4.39dv93deg1k44";', '192.185.24.133', '', 1478197023),
('90fbfe2b5b7f340100b83216ac04a7e3', 'csrf|s:26:"3vg5nin244is4.qqcwlop197ek";', '192.185.24.133', '', 1478119862),
('9164391aca9828d02447894c3005ac13', 'csrf|s:27:"3vg5nin244is4.1yc72xp5cuqs8";', '192.185.24.133', '', 1478174405),
('938df85e40cad1e69887aed68b27528e', 'csrf|s:27:"3vg5nin244is4.1ygi6uj8zfeso";', '192.185.24.133', '', 1478208841),
('94eb25a5d50aaba78f4bc494e05ab9d5', 'csrf|s:27:"3vg5nin244is4.1u036ntcychbg";', '192.185.24.133', '', 1478109605),
('956f9f1bdd456c7b3027f711bd8dea72', 'csrf|s:27:"3vg5nin244is4.37sl8m5drlkwg";', '192.185.24.133', '', 1478161022),
('962a12a7aedcab263ee4f6732f205666', 'csrf|s:27:"3vg5nin244is4.3gy8zyciydog4";', '192.185.24.133', '', 1478091062),
('97e3cb395e0805c7ec10ba3f7de572d5', 'csrf|s:26:"3vg5nin244is4.jjwskvfqvo62";', '192.185.24.133', '', 1478116262),
('9b2f18cd089f987bf3d07271adb0b1a7', 'csrf|s:27:"3vg5nin244is4.1bif568a3a5fs";', '192.185.24.133', '', 1478147641),
('9c0a76aaa8f69ca52aaa5bb4cc989a22', 'csrf|s:27:"3vg5nin244is4.2unknuuzi1wkk";', '192.185.24.133', '', 1478079242),
('9d29be70e1286dcd264d21c5bf8e994e', 'csrf|s:27:"3vg5nin244is4.39j571b11qo0w";', '192.185.24.133', '', 1478155862),
('9eaa61d82e200e15b43dfc6af53f578a', 'csrf|s:26:"3vg5nin244is4.2is4nwasam0a";', '192.185.24.133', '', 1478105462),
('9ee638e4a8c69c409760df598e235626', 'csrf|s:27:"3vg5nin244is4.31elqzibl5ycw";', '192.185.24.133', '', 1478219642),
('9fb321e4e24e4a509cd7ccec1cdea1cf', 'csrf|s:27:"3vg5nin244is4.2dgr8t63sfy8o";', '192.185.24.133', '', 1478204221),
('a15f141ba6f7f0ae1a617ee28ccecc68', 'csrf|s:26:"3vg5nin244is4.thdm8ppiqfh2";', '192.185.24.133', '', 1478087461),
('a1b84ed70fdbd6876d3680d66a704f08', 'csrf|s:27:"3vg5nin244is4.196p18rhe8of4";', '192.185.24.133', '', 1478199603),
('a2ab6039dafe1ee0fb57f4e0d51a2aae', 'csrf|s:26:"3vg5nin244is4.wgdwgt2nl6or";', '192.185.24.133', '', 1478140441),
('a33ee717f0031db12f29cfe5ebe2e824', 'csrf|s:27:"3vg5nin244is4.1pbynj91kg9r9";', '66.102.6.137', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 Google Favicon', 1478127988),
('a519981d06a4b141f4527e8b535b688e', 'csrf|s:26:"3vg5nin244is4.jjuzc20dl4e6";', '192.185.24.133', '', 1478148662),
('a54578b61d9d1a6e6ee87bee219b3862', 'csrf|s:27:"3vg5nin244is4.21pg0lx9fe1w4";', '192.185.24.133', '', 1478157422),
('a5ee45c85936cb261b57048c27b7b475', 'csrf|s:26:"3vg5nin244is4.l95jy2y7wjg0";', '192.185.24.133', '', 1478127604),
('a6ebff3911c930008f19690b93cc9528', 'csrf|s:27:"3vg5nin244is4.3616p7gzch6ok";', '192.185.24.133', '', 1478098262),
('a72f060df4d7daedd77cd578abd23c20', 'csrf|s:27:"3vg5nin244is4.169akp1tfjfbq";', '192.185.24.133', '', 1478203204),
('a76a53673884d94a13a8c7a71f5611c1', 'csrf|s:26:"3vg5nin244is4.5l2uwf47c9rm";', '192.185.24.133', '', 1478090042),
('a7a8110c659ec8c07ff7ef98112d673b', 'csrf|s:27:"3vg5nin244is4.3dboov6e9pusg";', '192.185.24.133', '', 1478228405),
('a7f4a053d96a83f0b86d2d233bb4b6a1', 'csrf|s:26:"3vg5nin244is4.qdxlliobvf8b";', '192.185.24.133', '', 1478096222),
('a81ecbefede2ce115cb44ef7617c551b', 'csrf|s:26:"3vg5nin244is4.y7ikv1kqiagx";', '192.185.24.133', '', 1478088004),
('a88967c5c61ae5dfa38cb640a3f502ba', 'csrf|s:27:"3vg5nin244is4.373kqg1k49ick";', '192.185.24.133', '', 1478167204),
('ae46f7373ba46140e32768a37dc906b6', 'csrf|s:27:"3vg5nin244is4.35l897nq8m0w8";', '192.185.24.133', '', 1478073061),
('aec9caf90fc392e0491afec3088b18b8', 'csrf|s:27:"3vg5nin244is4.29epcaamnkis8";', '192.185.24.133', '', 1478171821),
('b16c42a48fd146f372064e091d43341b', 'csrf|s:27:"3vg5nin244is4.2jthwnenheg4w";', '192.185.24.133', '', 1478230442),
('b1a7d6d15ff8c1695b9888022af48470', 'csrf|s:26:"3vg5nin244is4.cplmbvq1ix89";', '192.185.24.133', '', 1478194442),
('b220b66bf8cf75dbc4b936a2f1ef23c8', 'csrf|s:27:"3vg5nin244is4.14xbmneyuqp75";', '192.185.24.133', '', 1478172842),
('b2937f592e7227289f8c6f116aa3377e', 'csrf|s:27:"3vg5nin244is4.2i3gdz2qqc4k4";', '192.185.24.133', '', 1478095204),
('b2f4fb79fa0f1457cdbd35943bffa546', 'csrf|s:27:"3vg5nin244is4.3q16vgjeqxic0";', '192.185.24.133', '', 1478154842),
('b317403ced6133ed321dfcf696e5152c', 'csrf|s:27:"3vg5nin244is4.1csyztkoofz76";', '192.185.24.133', '', 1478198041),
('b525cd2aebec6739a62dc7402d12e8ee', 'csrf|s:27:"3vg5nin244is4.3oouq96ytx44o";', '192.185.24.133', '', 1478081822),
('b83e6d884b6c31c025578c15e73734b2', 'csrf|s:26:"3vg5nin244is4.crwem33i88hp";', '192.185.24.133', '', 1478108042),
('b900bd1e481856edc20f32a6e890bf8c', 'csrf|s:26:"3vg5nin244is4.1u8i1n48kjbn";', '192.185.24.133', '', 1478122442),
('b98416afb20b0046161699dfc6c57c57', 'csrf|s:26:"3vg5nin244is4.vls70k5ri0sy";', '192.185.24.133', '', 1478189822),
('ba1306137cc507b7e263a1e87f1c2bbb', 'csrf|s:26:"3vg5nin244is4.g9wv08hafp8q";', '192.185.24.133', '', 1478073602),
('bdbc0f6f8cf5e3f077c58001f3134469', 'csrf|s:27:"3vg5nin244is4.1oulbw44zpwvv";', '192.185.24.133', '', 1478152261),
('bfb8720a033af59b3a11509a588c9246', 'csrf|s:27:"3vg5nin244is4.2rldeohg4bc4w";', '192.185.24.133', '', 1478109062),
('c12332c863ea9bde0de9f35565aad0eb', 'csrf|s:27:"3vg5nin244is4.34cikes1ywe88";', '192.185.24.133', '', 1478164622),
('c5734d8ff3fb8d7636ddace90ee754e9', 'csrf|s:27:"3vg5nin244is4.2xzu8a493agwo";', '192.185.24.133', '', 1478123462),
('c6e8be5d9d5163f189be2084e861bb75', 'csrf|s:27:"3vg5nin244is4.1z3s972fstggg";', '192.185.24.133', '', 1478149204),
('c7ecf4212bf208ce78dc97c7211d32dc', 'csrf|s:27:"3vg5nin244is4.1ppy2fuj370ef";', '192.185.24.133', '', 1478089021),
('c8111c5ebf8b35befe26e2c9634a9e00', 'csrf|s:27:"3vg5nin244is4.3a388jgkosqo8";', '192.185.24.133', '', 1478162041),
('c95a2b39d9892845400e29933db8f10e', 'csrf|s:27:"3vg5nin244is4.2unf3ttzk2yog";', '192.185.24.133', '', 1478177462),
('ca2ef1214d9ebc1d341d66d75d6dea98', 'csrf|s:27:"3vg5nin244is4.3qnwanwu910kc";', '192.185.24.133', '', 1478202662),
('cbb8565baa79df548de25a689e2fca74', 'csrf|s:27:"3vg5nin244is4.37fng1xpsu80k";', '192.185.24.133', '', 1478233021),
('d1566387c424737df924be6884105315', 'csrf|s:27:"3vg5nin244is4.193tg2fz20md1";', '192.185.24.133', '', 1478181061),
('d21a43ed289a155e9057fb066af8daa7', 'csrf|s:27:"3vg5nin244is4.3lly817ylskk4";', '192.185.24.133', '', 1478128621),
('d23d03be69ceb66d666ba945ccc79d88', 'csrf|s:27:"3vg5nin244is4.3t20ep1p83s40";', '192.185.24.133', '', 1478183641),
('d2f60ae7e76038d6f0df5c12532a24f4', 'csrf|s:27:"3vg5nin244is4.1um4vq7eizf1q";', '192.185.24.133', '', 1478207822),
('d390998ac3730fe3098974d016e707c0', 'csrf|s:26:"3vg5nin244is4.24qqky6ckuuc";', '192.185.24.133', '', 1478077205),
('d3ac14a032d01b03613a9a23e0a2732a', 'csrf|s:27:"3vg5nin244is4.2gk4rtd1gpes8";', '192.185.24.133', '', 1478145062),
('d4c6c745e012ee8dde645be4d9bc5e20', 'csrf|s:27:"3vg5nin244is4.3876r5qypx4w0";', '192.185.24.133', '', 1478220661),
('da89dd249923ee676eca8a65fb2542c4', 'csrf|s:27:"3vg5nin244is4.1zj39ufxoz28s";', '192.185.24.133', '', 1478217604),
('db819d39da39d3a6418b9262019cf4c9', 'csrf|s:27:"3vg5nin244is4.2i7mckjt2144g";', '192.185.24.133', '', 1478209862),
('dbeeb788c981120e28c0c3ce30aa1d83', 'csrf|s:27:"3vg5nin244is4.2z73pystcfcw4";', '192.185.24.133', '', 1478102404),
('dc038a1b6cd9d6477740ad1096d0b0f0', 'csrf|s:26:"3vg5nin244is4.5o9c8jgg6mri";', '41.170.3.33', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/601.7.8', 1478154905),
('dc8b9ab7f9f6c6708fe315b8d33cc388', 'csrf|s:27:"3vg5nin244is4.2gzfqk51hjmss";', '192.185.24.133', '', 1478099822),
('dd146fb43b2673d3f6c8828304e3d903', 'csrf|s:27:"3vg5nin244is4.32bthyhvd6w4k";', '192.185.24.133', '', 1478150222),
('de1ee4d9c31895c5f8a053200e24e97f', 'csrf|s:27:"3vg5nin244is4.2yu6yekzbois4";', '192.185.24.133', '', 1478163603),
('df8bb37f9eacf5bbcbbd47a804f9e329', 'csrf|s:27:"3vg5nin244is4.2cgtpg35x1s0w";', '192.185.24.133', '', 1478206805),
('e0314443b17e478a377ded1fc29d9143', 'csrf|s:27:"3vg5nin244is4.1b1b27k6rfngw";', '192.185.24.133', '', 1478093642),
('e0aedff06111a355b1248ecb747038d7', 'csrf|s:27:"3vg5nin244is4.3laxs6lw38is4";token|s:128:"d5d7aa9e0af0426bb4665508f5d1d982a977889d9d16f94aa89769c0f6226a5c6366795824f30e1ca70c09b1465e98cf88ea91a6de2345fc0b7bfc178821c048";user|s:12:"000000000005";username|s:5:"Rohan";', '117.198.54.60', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36', 1478179878),
('e13bcde4861dc0c74e4769f9cf13c64a', 'csrf|s:27:"3vg5nin244is4.3dy3d656y1k4w";', '192.185.24.133', '', 1478166662),
('e1ea930da6698f475e7a5363e0fd2ae0', 'csrf|s:27:"3vg5nin244is4.1swyzyjdmt3xq";', '192.185.24.133', '', 1478176441),
('e398daf9a90da715bd6b75045c311651', 'csrf|s:26:"3vg5nin244is4.z7bjgdoqgknd";', '192.185.24.133', '', 1478165642),
('e3fcaa01d7e8befaf3764cf42b1d91d1', 'csrf|s:27:"3vg5nin244is4.1bmwesgr8kv84";', '192.185.24.133', '', 1478138404),
('e49226bdd1500d8ff22ea764068924d4', 'csrf|s:27:"3vg5nin244is4.2lt2602hfla8s";', '192.185.24.133', '', 1478091603),
('e58881f36cdbe190d4cbe7743114ac7c', 'csrf|s:27:"3vg5nin244is4.3oua1igdpbggc";', '192.185.24.133', '', 1478175421),
('e6ca359ea8a34a8937a1253b8f3d1f27', 'csrf|s:27:"3vg5nin244is4.13kzn4kdewe99";', '192.185.24.133', '', 1478144041),
('e73d1c943778e0fbd4782f1a5ca04de2', 'csrf|s:27:"3vg5nin244is4.1x8ottvrvkmir";', '192.185.24.133', '', 1478146622),
('e7781bb752875bc1c685b29933a407e8', 'csrf|s:26:"3vg5nin244is4.gw8trb7r6pg7";', '192.185.24.133', '', 1478151243),
('e92cfb10ccd172e158a48eb52d1ddace', 'csrf|s:26:"3vg5nin244is4.ow03tpk7icvi";', '192.185.24.133', '', 1478136842),
('e936ed14b5a87e1e9ced9fa96994558d', 'csrf|s:26:"3vg5nin244is4.uty412o0lk0e";', '192.185.24.133', '', 1478143021),
('ebe791715c1a36a1977e1ff8fc7b5898', 'csrf|s:27:"3vg5nin244is4.1afno0kig5vzu";', '192.185.24.133', '', 1478132221),
('ec4ec3a620ca1d95dad9657bd345bca6', 'csrf|s:27:"3vg5nin244is4.3s0flw0a4yww4";', '192.185.24.133', '', 1478106004),
('ee4a39a986e385b740cc4e486bbc3814', 'csrf|s:26:"3vg5nin244is4.uciwm9kgbdxo";', '192.185.24.133', '', 1478187242),
('eec14de2b0a7c0b30a5a5e946e273466', 'csrf|s:27:"3vg5nin244is4.346uo87h4twkc";', '192.185.24.133', '', 1478232003),
('f2fd49f42f0059062fb972f091820741', 'csrf|s:27:"3vg5nin244is4.1ffvsjlg25pg3";', '47.30.159.121', 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; SM-G925I Build/MMB29K)', 1478091664),
('f313b37c55f23a46cc6c9965ae088799', 'csrf|s:27:"3vg5nin244is4.2vksdqya4d0ko";', '192.185.24.133', '', 1478227861),
('f7b83d9244cbe9407cbd5474cc8224eb', 'csrf|s:27:"3vg5nin244is4.2sbmftqmylgkg";', '192.185.24.133', '', 1478225821),
('f800b121f04d36d7e9f3e5b188405dfc', 'csrf|s:27:"3vg5nin244is4.14edyr0dlya6s";', '192.185.24.133', '', 1478139421),
('f859537c93c0ea3e80fb46d7dff09509', 'csrf|s:27:"3vg5nin244is4.3nq219jpc52c8";', '192.185.24.133', '', 1478211422),
('fcaeb114d29683a9b4813a656906659c', 'csrf|s:27:"3vg5nin244is4.3o2nimqwym2ow";', '192.185.24.133', '', 1478125022);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci,
  `user` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `user`) VALUES
(1, 'Demo', 1),
(2, 'Test', 1),
(3, 'dev', 1),
(4, 'note', 1),
(5, 'changelog', 1),
(9, 'anothertag', 1),
(10, 'tag hier', 6),
(11, 'tag one', 5),
(12, 'tag two', 5),
(14, 'Tag', 8),
(17, 'zdvzvzd', 12),
(18, 'vz', 12),
(19, 'd', 12),
(20, 'donkeykong', 13),
(21, 'septicflesh', 13),
(22, 'monkeydown', 13),
(25, 'dsgsdg', 12),
(27, 'Vbd', 11),
(28, 'Snap', 21),
(29, 'Bit', 21),
(30, 'Test', 21),
(33, 'sdf', 12),
(34, 'sdsfsg', 12),
(35, 'fss', 12),
(36, 'gth', 12),
(37, 'dvdv', 25),
(38, 'jhgvjh', 12),
(39, 'jack', 11),
(42, 'gf', 26),
(43, 'dfg', 26),
(44, 'Recipes', 5),
(45, 'Gardening', 5),
(46, 'Class notes', 5),
(47, 'Psychology', 5),
(48, 'Diary', 5),
(49, 'tag1', 28),
(50, 'tag2', 28),
(51, 'tag space tag', 28),
(52, 'help me', 28),
(53, 'Test', 30);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `username` text COLLATE utf8_unicode_ci,
  `password` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` text COLLATE utf8_unicode_ci,
  `time` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `premium` tinyint(1) DEFAULT NULL,
  `lock_password` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `time`, `active`, `premium`, `lock_password`) VALUES
(1, 'admin', '$2y$10$Epzsg209D5KslE8sPMfMnOPh1/flvP17Veu2KuhkRI01kXCRJ2N42', 'admin@gmail.com', '2016-07-14 01:53:00', 1, NULL, NULL),
(3, 'noelle@karbonblack.com', '$2y$10$3DGtq.mDALAtRRkhSnpele6HB/2fm0XfK73LV4e51oxqFpsBhBX6O', 'noelle@karbonblack.com', '2016-08-11 06:37:17', 1, 1, NULL),
(4, 'noelle.cloete@gmail.com', '$2y$10$4p94kP8vOF9o0Bl3e.xa/OIK1uQvE.Ze3HhF12pn6EYPXOSLci8c.', 'noelle.cloete@gmail.com', '2016-08-11 06:46:01', 1, 1, NULL),
(5, 'Rohan', '$2y$10$hBoM9Y4erSdhuIr2APzzXu2C79JYJTD0zMJboMkdST20i/mYcGrkO', 'rohan@gmail.com', '2016-08-22 00:59:53', 1, -1, '$2y$10$9c1JN/9PceITev6Y1iXm0OYVuYfcejstjTcUbzVDQ2Vbeui3qdCvm'),
(6, 'Magdaleen', '$2y$10$E/G0nwlgaE5JJAbTw5Hno./HPg5B8OkROIebtcXZtLEs1sy0TlUA2', 'magdaleen@karbonblack.com', '2016-08-24 03:28:59', 1, 1, NULL),
(7, 'Test17', '$2y$10$/6Y/x/f6Cf5PfYmJFehfKOUdjGgqwZep.WfJ2sk/vxmWdqEK6/VJ2', NULL, '2016-09-05 03:01:46', 1, 1, NULL),
(8, 'Maggie', '$2y$10$rCUJPlLBi4Scd6opfpsR5u44UWFpMf3Rdi7aHDkRhCFMsxqgg/Y2q', 'magdaleendv@gmail.com', '2016-09-05 03:05:41', 1, 1, NULL),
(9, 'corneile', '$2y$10$AGASqSstWDGHpm04syLb8O/hRo99giFkdAjiVf0Zyi91fRD0njpge', 'corneile@karbonblack.com', '2016-09-05 08:16:53', 1, 1, NULL),
(10, 'Test34', '$2y$10$w7IovBxNH1HyGyxgIgvHwudSFJlqPOeOW40sJr4ka.Zzdjfms.fwa', 'test34@gmail.com', '2016-09-16 01:33:27', 1, 1, NULL),
(11, 'Test1', '$2y$10$b3dMoRavTYWrX6Y5wXERROzOAm33n54uFUQRfTUtYFzdfzq4VJiiO', 'test1@gmail.com', '2016-09-20 02:45:14', 1, 1, NULL),
(12, 'Test2', '$2y$10$6.CU1nRlJCh11E.N7Q9HXeX6WLXFLE.E8fm1gHcrD8FglHaFBR0vm', 'test2@gmail.com', '2016-09-20 04:05:54', 1, 1, '$2y$10$7tPPM30ireVgHkMK58ESVOAp41NfQAsB9FMgtFkR7T0w/l5uLNwEm'),
(13, 'jjvanwyk', '$2y$10$NlX3ik4VoA0MBDdLNypwQeqpT.NTSeXB7uf5FoahtpPOBc/l9QPSe', 'jj.vanwyk@gmail.com', '2016-09-20 05:56:01', 1, 1, NULL),
(14, 'test3', '$2y$10$53EYaJEmIlGZCHuYi2kEaOtW/E1O9c6JNVmkNMTYzYvNw83A2idR.', 'test3@gmail.com', '2016-09-20 07:37:16', 1, 1, NULL),
(15, 'Test', '$2y$10$EkE9Owlue14gLn4qRgscAeHlUh1lxLkI/mh8KfAYyuhx6SLXmraCC', 'tesyhs@hshj.com', '2016-09-20 19:38:02', 1, 1, NULL),
(16, 'sdsd', '$2y$10$yvj20I.5wR1V8dDSbcxsNePGwkIxsOAWhEGXOKctMKWNSCIlIZ7ay', 'sdfsdf@gmail.com', '2016-09-21 08:05:23', 1, 1, NULL),
(17, 'Test4', '$2y$10$XOckIJMaPcBBKNVYOghaGu5k67jFUXpfzm5S8avV3mGiV0ivOeaJm', 'test4@gmail.com', '2016-09-22 01:54:57', 1, 0, NULL),
(18, 'CEvdD34', '$2y$10$kNV0g8DU9giTBCD20kfBuuaGcDuUUabP5fqovYubXMd2g2Hhqjo9a', 'cesvdd@gmail.com', '2016-09-22 04:16:04', 1, 0, NULL),
(19, 'Test7', '$2y$10$YukGjyCwde/nq3y0JVrbRem/Wh5zBkfau3DN8efTyo1w5do71G5ai', 'test7@gmail.com', '2016-09-23 02:53:05', 1, 0, NULL),
(20, 'Test10', '$2y$10$LvNtTt.JJydPzloAKQHDI.qlnYASupOa76uGzp8LkUlflkEeqx0aq', 'test10@gmail.com', '2016-09-23 04:47:57', 1, 0, NULL),
(21, 'Marcel du Preez', '$2y$10$ZyzL8a3wINGCaSOqsBohhe1R7UWpeR1fR6h7b0yHsnGP61.VydkWa', 'marcel@karbonblack.com', '2016-09-23 05:07:26', 1, 0, NULL),
(24, 'jacotest', '$2y$10$7GZ1O2VzuF6WXqzTJ4vb5uus3joPlgalKO84AhrMKZHiJNAOky8hC', 'jaco@snapbill.com', '2016-09-23 10:07:33', 1, 0, NULL),
(25, 'TestFree', '$2y$10$OLC.8LSYKCUIPZrXzCQKK.yv7NO8nwbndBV4Gbmb8bDOjscEXP6dq', 'testfree@gmail.com', '2016-09-26 06:15:36', 1, 0, NULL),
(26, 'Test9', '$2y$10$1.tbMvR/izoPzX87eV/72e3IOA4WbkLIXG.553wjQ//BuIzKy.4mi', 'test9@gmail.com', '2016-10-03 07:21:13', 1, 1, NULL),
(27, 'Magdaleen123', '$2y$10$c5uddiAJCVWPmAKwJaCvmeeEDCKi4E2Phm1b5Y7TfLxyP/iteS3Iu', 'maggie@karbonblack.com', '2016-10-20 07:11:56', 1, 0, NULL),
(28, 'jacotesting', '$2y$10$VABvTgEyYwrg0qGkwNtaJ.Q0CRPBWRYHcnRcKaqsSVK2a9R/nKiXu', 'jj.vanwyk+snapbits@gmail.com', '2016-10-24 06:20:06', 1, -1, '$2y$10$09MKO134Ljfnj8DjN/XqZO0BIxR8ta0wh7OU6dv9zo5EyfOPD21OW'),
(29, 'cliebenb', '$2y$10$uyH15rq9Ezamm.HwKdrWAOcPr/Y08VkM/fnly9.w16.IWs8vpPngG', 'corneile@mac.com', '2016-10-24 09:34:25', 1, 0, NULL),
(30, 'cesvdd', '$2y$10$F3XXrZQhcfdDxgDSWmMhGef.1CmUYmKDOVGJB2kCyjD2.zLWy5xZa', 'ce@karbonblack.com', '2016-10-28 07:15:19', 1, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `metadata`
--
ALTER TABLE `metadata`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts__tags_mm_tags__posts`
--
ALTER TABLE `posts__tags_mm_tags__posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `metadata`
--
ALTER TABLE `metadata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=70;
--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=84;
--
-- AUTO_INCREMENT for table `posts__tags_mm_tags__posts`
--
ALTER TABLE `posts__tags_mm_tags__posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=149;
--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=63;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
