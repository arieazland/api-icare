-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 06, 2021 at 09:20 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `icare`
--

-- --------------------------------------------------------

--
-- Table structure for table `icare_aassessment`
--

CREATE TABLE `icare_aassessment` (
  `id` int(11) NOT NULL,
  `id_pertanyaan` int(11) NOT NULL,
  `id_account` int(11) NOT NULL,
  `jawaban` longtext NOT NULL,
  `status` enum('aktif','hapus') NOT NULL DEFAULT 'aktif',
  `date_created` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `time_created` time DEFAULT NULL,
  `time_updated` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `icare_aassessment`
--

INSERT INTO `icare_aassessment` (`id`, `id_pertanyaan`, `id_account`, `jawaban`, `status`, `date_created`, `date_updated`, `time_created`, `time_updated`) VALUES
(1, 25, 13, 'test jawaban 1', 'aktif', NULL, NULL, NULL, NULL),
(2, 26, 13, 'test jawaban 2', 'aktif', NULL, NULL, NULL, NULL),
(3, 27, 13, 'test jawaban 3', 'aktif', NULL, NULL, NULL, NULL),
(4, 28, 13, 'test jawaban 4', 'aktif', NULL, NULL, NULL, NULL),
(5, 29, 13, 'test jawaban 6', 'aktif', NULL, NULL, NULL, NULL),
(17, 20, 13, 'Jawaban soal pertama', 'aktif', '2021-06-17', NULL, '19:20:29', NULL),
(18, 21, 13, 'Jawaban soal kedua', 'aktif', '2021-06-17', NULL, '19:20:29', NULL),
(19, 22, 13, 'Jawaban soal ketiga', 'aktif', '2021-06-17', NULL, '19:20:29', NULL),
(20, 23, 13, 'Jawaban soal keempat', 'aktif', '2021-06-17', NULL, '19:20:29', NULL),
(21, 24, 13, 'Jawaban soal kelima', 'aktif', '2021-06-17', NULL, '19:20:29', NULL),
(22, 1, 12, 'putih', 'aktif', '2021-06-29', NULL, '09:30:41', NULL),
(23, 2, 12, 'lari ke arah kuda', 'aktif', '2021-06-29', NULL, '09:30:41', NULL),
(24, 3, 12, 'terbuka', 'aktif', '2021-06-29', NULL, '09:30:41', NULL),
(25, 5, 12, 'kosong', 'aktif', '2021-06-29', NULL, '09:30:41', NULL),
(26, 6, 12, 'tidak', 'aktif', '2021-06-29', NULL, '09:30:41', NULL),
(27, 1, 9, 'hitam', 'aktif', '2021-06-30', NULL, '21:43:22', NULL),
(28, 2, 9, 'lari dan bersembunyi di bawah jembatan', 'aktif', '2021-06-30', NULL, '21:43:22', NULL),
(29, 3, 9, 'tertutup', 'aktif', '2021-06-30', NULL, '21:43:22', NULL),
(30, 5, 9, 'air penuh', 'aktif', '2021-06-30', NULL, '21:43:22', NULL),
(31, 6, 9, 'mengambilnya', 'aktif', '2021-06-30', NULL, '21:43:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `icare_account`
--

CREATE TABLE `icare_account` (
  `id` int(11) NOT NULL,
  `id_card` varchar(128) DEFAULT NULL,
  `id_card_type` varchar(128) DEFAULT NULL,
  `email` varchar(128) NOT NULL,
  `username` varchar(128) DEFAULT NULL,
  `nama` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `tempat_lahir` varchar(256) DEFAULT NULL,
  `account_type` enum('admin','peserta','peserta_event','perusahaan','konsultan','psikologis','nonaktif') NOT NULL DEFAULT 'peserta',
  `no_sip` varchar(25) DEFAULT NULL,
  `no_str` varchar(25) DEFAULT NULL,
  `namafile` text DEFAULT NULL,
  `pendidikan` enum('d3','s1','s2','s3') DEFAULT NULL,
  `universitas` varchar(256) DEFAULT NULL,
  `fakultas` varchar(256) DEFAULT NULL,
  `jurusan` varchar(128) DEFAULT NULL,
  `tahun_lulus` int(5) DEFAULT NULL,
  `comp_bidang_usaha` text DEFAULT NULL,
  `comp_deskripsi` text DEFAULT NULL,
  `comp_website` varchar(256) DEFAULT NULL,
  `comp_contact_person` bigint(20) DEFAULT NULL,
  `comp_alamat` text DEFAULT NULL,
  `date_created` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `time_created` time DEFAULT NULL,
  `time_updated` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `icare_account`
--

INSERT INTO `icare_account` (`id`, `id_card`, `id_card_type`, `email`, `username`, `nama`, `password`, `phone`, `tanggal_lahir`, `tempat_lahir`, `account_type`, `no_sip`, `no_str`, `namafile`, `pendidikan`, `universitas`, `fakultas`, `jurusan`, `tahun_lulus`, `comp_bidang_usaha`, `comp_deskripsi`, `comp_website`, `comp_contact_person`, `comp_alamat`, `date_created`, `date_updated`, `time_created`, `time_updated`) VALUES
(1, NULL, NULL, 'admin@admin.com', NULL, 'Admin', '$2a$08$N1Py8ET762i.KIqDcrRG6.9js.2Hu9slsFcYwSXUhTgRBcDIpT3TW', NULL, NULL, 'Jakarta', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, NULL, NULL, 'admin2@admin.com', NULL, 'Admin 2', '$2b$08$.I9h7uSZvvhjcm0vEJ5mFODVlR5TLIkpjLfbiFfR5mnjf7Hy7gVw6', NULL, NULL, NULL, 'nonaktif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, NULL, NULL, 'admin3@admin.com', NULL, 'Admin 3', '$2b$08$gP7pI6kfBrBa4GIwXNLQuOZsruKFQ2DydmVfUL4BtLxSnLHFG3/Bm', NULL, NULL, NULL, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, NULL, NULL, 'admin4@admin.com', NULL, 'Admin 4', '$2b$08$8pW2Ca5j1poDKwGkvlLTCeDbAxJEefHSrP2h/fI/q7JqnOHLAYPXu', NULL, NULL, NULL, 'nonaktif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, NULL, NULL, 'test@example.com', NULL, 'test', '$2b$08$rVr4f8dFwf7Eg6BlgoX4I.LnehNIaFXDRIk2f/B0jU7w12cg7Gcf6', NULL, NULL, NULL, 'psikologis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, NULL, NULL, 'test2@example.com', NULL, 'test2', '$2b$08$bQuYm7XHBImuICWM1tPRwO459MPtrg8rE56Jj.ZOXpqiwd.nKzJEW', NULL, NULL, NULL, 'nonaktif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, NULL, NULL, 'dedi@example.com', NULL, 'Dedi', '$2b$08$K.c42z/FiWdBivrp7b/RveHAPmbFOzkDwGhU9U5fjRWv9QHq4VAce', NULL, NULL, NULL, 'psikologis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, NULL, NULL, 'tara@example.com', NULL, 'Tara B.A, M.Psi', '$2b$08$qSYmNfpxz8acGufYfQhZoeSyA7YZ7j7q28hNcVO1F45vYhQ3HAnRO', NULL, NULL, NULL, 'psikologis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, NULL, NULL, 'teguh@example.com', NULL, 'Teguh', '$2b$08$AWUeVmDx869EV7VEmPkPbOEmcXd2D4sm1MYO/VEsLkEZ/WFZlGXnG', NULL, NULL, NULL, 'peserta_event', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, NULL, NULL, 'ridwan2@example.com', NULL, 'Ridwan 2', '$2b$08$4tFq2VN42S53AmNAW0.LfONmo.O64AelEU5GWvFMH60pf59/LzaMq', NULL, NULL, NULL, 'psikologis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, NULL, NULL, 'pacu@example.com', NULL, 'Pacu Putra', '$2b$08$CXpLjjyqo6L2BNohkppM0.xhWfYmPWAkV513eKsBfCMve2SszlRCG', NULL, NULL, NULL, 'peserta_event', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-06-09', '2021-06-09', '12:46:46', '12:46:46'),
(13, NULL, NULL, 'abdi@example.com', NULL, 'Abdi', '$2b$08$1EwM9EwrtOE6x5tANvLRC.3m7CHfvZQZckpO40Qm3VgxQEKkta8Ry', NULL, NULL, NULL, 'peserta_event', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-06-09', '2021-06-09', '12:52:25', '13:16:44');

-- --------------------------------------------------------

--
-- Table structure for table `icare_chat_message`
--

CREATE TABLE `icare_chat_message` (
  `id` int(11) NOT NULL,
  `id_chat_room` int(11) NOT NULL,
  `sender` int(11) NOT NULL,
  `receiver` int(11) NOT NULL,
  `message` longtext NOT NULL,
  `date_created` date NOT NULL,
  `date_updated` date NOT NULL,
  `time_created` time NOT NULL,
  `time_updated` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `icare_chat_room`
--

CREATE TABLE `icare_chat_room` (
  `id` int(11) NOT NULL,
  `id_consult_type` int(11) NOT NULL,
  `date_created` date NOT NULL,
  `date_updated` date NOT NULL,
  `time_created` time NOT NULL,
  `time_updated` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `icare_conc`
--

CREATE TABLE `icare_conc` (
  `id` int(11) NOT NULL,
  `id_consult_type` int(11) NOT NULL,
  `id_account` int(11) NOT NULL,
  `conc` longtext NOT NULL,
  `verified_by` int(11) NOT NULL,
  `status` enum('aktif','hapus') NOT NULL DEFAULT 'aktif',
  `date_created` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `time_created` time DEFAULT NULL,
  `time_updated` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `icare_conc`
--

INSERT INTO `icare_conc` (`id`, `id_consult_type`, `id_account`, `conc`, `verified_by`, `status`, `date_created`, `date_updated`, `time_created`, `time_updated`) VALUES
(1, 1, 12, 'test edit lagi', 1, 'hapus', '2021-06-30', '2021-07-06', '21:48:58', '12:48:20'),
(2, 1, 12, 'kesimpulan', 1, 'aktif', '2021-07-06', NULL, '13:53:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `icare_consult_acc`
--

CREATE TABLE `icare_consult_acc` (
  `id` int(11) NOT NULL,
  `id_account` int(11) NOT NULL,
  `id_tipe_konsultasi` int(11) NOT NULL,
  `date_created` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `time_created` time DEFAULT NULL,
  `time_updated` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `icare_consult_acc`
--

INSERT INTO `icare_consult_acc` (`id`, `id_account`, `id_tipe_konsultasi`, `date_created`, `date_updated`, `time_created`, `time_updated`) VALUES
(1, 5, 1, NULL, NULL, NULL, NULL),
(2, 7, 1, NULL, NULL, NULL, NULL),
(3, 11, 2, NULL, NULL, NULL, NULL),
(43, 8, 2, '2021-06-12', NULL, '01:33:57', NULL),
(44, 7, 2, '2021-06-12', NULL, '10:09:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `icare_consult_type`
--

CREATE TABLE `icare_consult_type` (
  `id` int(11) NOT NULL,
  `nama` varchar(256) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `direct_consult` enum('y','t') NOT NULL DEFAULT 't',
  `repeat_consult` enum('y','t') NOT NULL DEFAULT 't',
  `event_consult` enum('y','t') NOT NULL DEFAULT 't',
  `status_consult` enum('aktif','nonaktif','hapus') NOT NULL DEFAULT 'aktif',
  `date_created` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `time_created` time DEFAULT NULL,
  `time_updated` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `icare_consult_type`
--

INSERT INTO `icare_consult_type` (`id`, `nama`, `start`, `end`, `direct_consult`, `repeat_consult`, `event_consult`, `status_consult`, `date_created`, `date_updated`, `time_created`, `time_updated`) VALUES
(1, 'CDC Virtual Expo 2021', '2021-06-07', '2021-06-11', 'y', 't', 'y', 'aktif', NULL, NULL, NULL, NULL),
(2, 'Reguler', '1900-01-01', '9000-12-31', 'y', 'y', 't', 'aktif', NULL, NULL, NULL, NULL),
(3, 'Test Acara 2', '2021-06-20', '2021-06-25', 'y', 't', 'y', 'aktif', NULL, NULL, NULL, NULL),
(4, 'Test Acara 3', '2021-07-10', '2021-07-15', 'y', 't', 'y', 'aktif', '2021-06-09', '2021-06-09', '12:33:19', '14:00:13'),
(5, 'Test Hapus', '2021-06-26', '2021-06-30', 'y', 't', 'y', 'hapus', '2021-06-09', '2021-06-09', '14:01:31', '14:10:29');

-- --------------------------------------------------------

--
-- Table structure for table `icare_qassessment`
--

CREATE TABLE `icare_qassessment` (
  `id` int(11) NOT NULL,
  `id_consult_type` int(11) NOT NULL,
  `pertanyaan` longtext NOT NULL,
  `status` enum('aktif','hapus') NOT NULL DEFAULT 'aktif',
  `date_created` date DEFAULT NULL,
  `date_updated` date DEFAULT NULL,
  `time_created` time DEFAULT NULL,
  `time_updated` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `icare_qassessment`
--

INSERT INTO `icare_qassessment` (`id`, `id_consult_type`, `pertanyaan`, `status`, `date_created`, `date_updated`, `time_created`, `time_updated`) VALUES
(1, 1, 'Di seberang jembatan itu, ada seekor kuda. Apa warna kuda tersebut? Putih, abu-abu, coklat, atau hitam?', 'aktif', NULL, '2021-06-14', NULL, '18:55:00'),
(2, 1, 'Tiba-tiba tornado datang, kamu punya tiga pilihan: lari dan bersembunyi di dalam kotak, lari dan bersembunyi di bawah jembatan, lari ke arah kuda dan memacu kuda sejauh mungkin. Mana yang kamu pilih?', 'aktif', NULL, '2021-06-14', NULL, '18:52:36'),
(3, 1, 'Bayangkan kamu sedang berada di dalam hutan. Di tengah-tengah perjalanan, kamu melihat sebuah gubuk tua. Bagaimana kondisi pintu di gubuk itu? Apakah terbuka atau tertutup?', 'aktif', '2021-06-14', NULL, '17:26:37', NULL),
(5, 1, 'Di atas meja, ada sebuah pot bunga. Apakah pot tersebut terisi air penuh, setengah atau kosong?', 'aktif', '2021-06-14', NULL, '18:31:01', NULL),
(6, 1, 'Saat memasuki kastil, kamu melihat sebuah kolam berisi air. Kolam itu terlihat kotor tapi di dalamnya tampak batu permata yang berkilauan. Apakah kamu akan mengambil permata itu?', 'aktif', '2021-06-14', '2021-06-14', '18:35:31', '19:28:22'),
(7, 1, 'Test pertanyaan', 'hapus', '2021-06-14', '2021-06-14', '18:55:15', '19:27:09'),
(8, 1, 'test pertanyaan 2', 'hapus', '2021-06-14', '2021-06-14', '19:21:28', '19:26:32'),
(15, 2, 'pertanyaan 1', 'aktif', '2021-06-14', NULL, '23:01:09', NULL),
(16, 2, 'pertanyaan 2', 'aktif', '2021-06-14', NULL, '23:01:09', NULL),
(17, 2, 'pertanyaan 3', 'aktif', '2021-06-14', NULL, '23:01:09', NULL),
(18, 2, 'pertanyaan 4', 'aktif', '2021-06-14', NULL, '23:01:09', NULL),
(19, 2, 'pertanyaan 5', 'aktif', '2021-06-14', NULL, '23:01:09', NULL),
(20, 3, 'pertanyaan 1', 'aktif', '2021-06-14', NULL, '23:04:28', NULL),
(21, 3, 'pertanyaan 2', 'aktif', '2021-06-14', NULL, '23:04:28', NULL),
(22, 3, 'pertanyaan 3', 'aktif', '2021-06-14', NULL, '23:04:28', NULL),
(23, 3, 'pertanyaan 4', 'aktif', '2021-06-14', NULL, '23:04:28', NULL),
(24, 3, 'pertanyaan 5', 'aktif', '2021-06-14', NULL, '23:04:28', NULL),
(25, 4, 'Pertanyaan 1 untuk Acara 3', 'aktif', '2021-06-14', NULL, '23:30:34', NULL),
(26, 4, 'Pertanyaan 2 untuk Acara 3', 'aktif', '2021-06-14', NULL, '23:30:34', NULL),
(27, 4, 'Pertanyaan 3 untuk Acara 3', 'aktif', '2021-06-14', NULL, '23:30:34', NULL),
(28, 4, 'Pertanyaan 4 untuk Acara 3', 'aktif', '2021-06-14', NULL, '23:30:34', NULL),
(29, 4, 'Pertanyaan 5 untuk Acara 3', 'aktif', '2021-06-14', NULL, '23:30:34', NULL),
(30, 1, 'Pertanyaan 6', 'hapus', '2021-06-14', '2021-06-14', '23:36:31', '23:37:01'),
(31, 1, 'Pertanyaan 7', 'hapus', '2021-06-14', '2021-06-14', '23:36:31', '23:36:52'),
(32, 1, 'Pertanyaan 8', 'hapus', '2021-06-14', '2021-06-14', '23:36:31', '23:36:46'),
(33, 1, 'Pertanyaan 9', 'hapus', '2021-06-14', '2021-06-14', '23:36:31', '23:36:40'),
(34, 2, 'Pertanyaan 6', 'aktif', '2021-06-15', NULL, '07:13:08', NULL),
(35, 2, '', 'hapus', '2021-06-15', '2021-06-15', '07:13:08', '08:43:05'),
(36, 2, 'Pertanyaan 7', 'aktif', '2021-06-15', NULL, '08:43:24', NULL),
(37, 2, 'Pertanyaan 8', 'aktif', '2021-06-15', NULL, '08:43:24', NULL),
(74, 1, 'test', 'hapus', '2021-07-06', '2021-07-06', '13:50:40', '13:50:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `icare_aassessment`
--
ALTER TABLE `icare_aassessment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `icare_account`
--
ALTER TABLE `icare_account`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `account` (`email`,`nama`);

--
-- Indexes for table `icare_chat_message`
--
ALTER TABLE `icare_chat_message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `icare_chat_room`
--
ALTER TABLE `icare_chat_room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `icare_conc`
--
ALTER TABLE `icare_conc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `icare_consult_acc`
--
ALTER TABLE `icare_consult_acc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `icare_consult_type`
--
ALTER TABLE `icare_consult_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `icare_qassessment`
--
ALTER TABLE `icare_qassessment`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `icare_aassessment`
--
ALTER TABLE `icare_aassessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `icare_account`
--
ALTER TABLE `icare_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `icare_chat_message`
--
ALTER TABLE `icare_chat_message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `icare_chat_room`
--
ALTER TABLE `icare_chat_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `icare_conc`
--
ALTER TABLE `icare_conc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `icare_consult_acc`
--
ALTER TABLE `icare_consult_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `icare_consult_type`
--
ALTER TABLE `icare_consult_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `icare_qassessment`
--
ALTER TABLE `icare_qassessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
