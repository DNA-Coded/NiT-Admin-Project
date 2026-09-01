import { Employee } from '../types/attendance';
import { parseRawDataSet } from '../utils/employeeParser';

const rawData = `
1 | NIT/0017 | Prof. (Dr.) | Subhram Das | Admin | Principal
2 | NIT/0089 | Mr. | Ratan Das | Admin | Site Supervisor
3 | NIT/0197 | Mr. | Souren Banerjee | Admin | Asistant to Library
4 | NIT/0402 | Mr. | Debasis Saha | Admin | Jr. Office Assistant
5 | NIT/0479 | Mr. | Subham Mal | Admin | Jr. Office Assistant
6 | NIT/0530 | Mr. | Kalyan Sinha Roy | Admin | Library-Asistant
7 | NIT/0544 | Dr. | Nidhi Singh | Admin | Registrar
8 | NIT/0581 | Mr. | Sukanto Senapati | Admin | Store In-charge
9 | NIT/0694 | Ms. | Priyanka Bhattacharjee | Admin | Library-Asistant
10 | NIT/0706 | Ms. | Banashree Pal | Admin | Library-Asistant
11 | NIT/0723 | Mr. | Subham Dutta | Admin | Site Engineer
12 | NIT/0729 | Ms. | Punita Gaba | Admin | EXECUTIVE ADMINISTRATION
13 | NIT/0735 | Mr. | Soumitra Chakraborty | Admin | Executive in Accounts Department
14 | NIT/0793 | Mr. | Kushal Bardhan | Admin | Office Assistant (Exam cell)
15 | NIT/1298 | Ms. | Sreetama Basu | Admin | Office Executive
16 | NIT/1303 | Ms. | Soma Goswami | Admin | Front Office Executive
17 | NIT/1327 | Mr. | Debopam Nandy | Admin | Office Assistant (T & P)
18 | NIT/1329 | Mr. | Biswarup Bhattacharjee | Admin | Training & Placement Officer
19 | NIT/1383 | Mr. | Indradeep Majumder | Admin | Executive- Accounts
20 | NIT/1388 | Mr. | Shishir Kumar Sur | Admin | Executive-Marketing & Business Development
21 | NIT/1401 | Mr. | Rana Ghosh | Admin | Accounts - Executive
22 | NIT/1510 | Mr. | Atin Swarnakar | Admin | Site Intern
23 | NIT/1519 | Mr. | Debarun Paul | Admin | HR EXECUTIVE
24 | NIT/1584 | Mr. | Anil Kumar Sharma | Admin | Head - Talent Transformation
25 | NIT/1596 | Mr. | Arup Kumar Maity | Admin | Telecaller cum Admission Assistant
26 | NIT/1602 | Ms. | Debanneeta Bose | Admin | Office Executive
1 | NIT/0002 | Dr. | Indrani (Dey) Sarkar | PHYSICS | Associate Professor
2 | NIT/0030 | Dr. | Nikhilesh Sil | MATH | Associate Professor
3 | NIT/0070 | Mrs. | Debrupa (Pal) Palit | CA | Assistant Professor
4 | NIT/0087 | Ms. | Rajasi Ray | ENGLISH | Assistant Professor
5 | NIT/0112 | Dr. | Sagarika Chowdhury | CSE - AIML | Assistant Professor-HOD
6 | NIT/0118 | Dr. | Koushik Karmakar | CST | Assistant Professor-HOD
7 | NIT/0159 | Mrs. | Subhasree Bhattacharjee (Choudhury) | CA | Assistant Professor
8 | NIT/0168 | Dr. | Jayanta Pal | CSBS | Associate Professor-HOD
9 | NIT/0170 | Dr. | Sarbani Ganguly | CHEMISTRY | Assistant Professor-HOD
10 | NIT/0171 | Dr. | Sriparna Guha | BA | Assistant Professor-HOD
11 | NIT/0184 | Mrs. | Rupa Saha | CA | Assistant Professor-HOD
12 | NIT/0209 | Dr. | Chandrima Chakrabarti | CSE - DS | Associate Professor
13 | NIT/0221 | Dr. | Dhananjay Kr. Tripathi | PHYSICS | Assistant Professor
14 | NIT/0227 | Dr. | Soumen Ghosh | IT | Assistant Professor Dpty. (COE)
15 | NIT/0238 | Ms. | Dipu Mistry | EE | Assistant Professor
16 | NIT/0241 | Mr. | Soumen Pal | ECE | Assistant Professor
17 | NIT/0244 | Dr. | Bidyut Kumar Medya | IT | Professor & COE
18 | NIT/0247 | Dr. | Sandhya Pattanayak | ECE | Associate Professor
19 | NIT/0248 | Ms. | Sharmistha Basu | ENGLISH | Assistant Professor
20 | NIT/0250 | Mr. | Rajkumar Banerjee | CIVIL | Assistant Professor
21 | NIT/0251 | Dr. | Kaushik Sarkar | ECE | Assistant Professor
22 | NIT/0252 | Dr. | Susmita Karan | PHYSICS | Assistant Professor
23 | NIT/0254 | Dr. | Pranab Hazra | ECE | Assistant Professor-HOD
24 | NIT/0263 | Ms. | Sujata Kundu | IT | Assistant Professor
25 | NIT/0268 | Mr. | Anirban Bhar | IT | Assistant Professor
26 | NIT/0276 | Dr. | Rupa Bhattacharyya (Chakrabotry) | CHEMISTRY | Assistant Professor
27 | NIT/0282 | Ms. | Arpita Barman | ECE | Assistant Professor
28 | NIT/0283 | Dr. | Suchismita Maiti (Biswas) | IT | Associate Professor-HOD
29 | NIT/0342 | Dr. | Ashifuddin Mondal | CSE | Associate Professor
30 | NIT/0372 | Dr. | Anukul Maity | CSE | Assistant Professor
31 | NIT/0385 | Ms. | Swati (Banerjee) Barui | ECE | Assistant Professor
32 | NIT/0410 | Mr. | Abhijit Ghosh | ECE | Assistant Professor
33 | NIT/0414 | Dr. | Arkendu Mitra | EE | Assistant Professor
34 | NIT/0415 | Ms. | Kamalika Benerjee | EE | Assistant Professor
35 | NIT/0422 | Dr. | Bansari Deb Majumder | EE | Associate Professor-HOD
36 | NIT/0456 | Dr. | Sangita (Roy) Biswas | ECE | Associate Professor
37 | NIT/0468 | Ms. | Debjani Chakraborty | CSE | Assistant Professor
38 | NIT/0472 | Mr. | Sudhangshu Sarkar | EE | Assistant Professor
39 | NIT/0473 | Mr. | Abhipriya Halder | CIVIL | Assistant Professor
40 | NIT/0497 | Mr. | Soumya Bhattacharyya | IT | Assistant Professor
41 | NIT/0498 | Dr. | Shubhendu Banerjee | CSE | Assistant Professor
42 | NIT/0512 | Dr. | Moupali Roy | ECE | Assistant Professor
43 | NIT/0529 | Ms. | Subhra Mukherjee | EE | Assistant Professor
44 | NIT/0540 | Ms. | Priyanjali Mukherjee | EE | Assistant Professor Asst. COE
45 | NIT/0620 | Dr. | Susmita Das | ECS | Assistant Professor
46 | NIT/0638 | Mr. | Ankesh Samanta | ME | Assistant Professor
47 | NIT/0639 | Mr. | Akhtarujjaman Sarkar | ME | Assistant Professor
48 | NIT/0642 | Mr. | Arya Banerjee | CIVIL | Assistant Professor
49 | NIT/0654 | Mr. | Arghya Gupta | ME | Assistant Professor
50 | NIT/0696 | Mr. | Pallav Dutta | EE | Assistant Professor
51 | NIT/0727 | Dr. | Sumanta Kundu | EE | Assistant Professor
52 | NIT/0730 | Ms. | Debopriya Dey | MATH | Assistant Professor
53 | NIT/0731 | Dr. | Sumit Chabri | ME | Professor-HOD
54 | NIT/0740 | Dr. | Abhishek Hazra | CIVIL | Assistant Professor-HOD
55 | NIT/0744 | Ms. | Anasuya Mondal | CIVIL | Assistant Professor
56 | NIT/0751 | Dr. | Biswajit Halder | EE | Associate Professor
57 | NIT/0754 | Dr. | Shilpi Pal | MATH | Assistant Professor
58 | NIT/0755 | Ms. | Payel Mondal | MATH | Assistant Professor
59 | NIT/0760 | Dr. | Bishaljit Paul | EE | Assistant Professor
60 | NIT/0764 | Mr. | Somnath Chakraborty | BA | Assistant Professor
61 | NIT/0765 | Ms. | Sanghamitra Layek | ECS | Assistant Professor
62 | NIT/0772 | Dr. | Shambhu Nath Saha | IT | Associate Professor
63 | NIT/0780 | Dr. | Sourav Saha | CSE | Professor
64 | NIT/0781 | Dr. | Jagannibas Paul Choudhury | CSE | Professor
65 | NIT/0791 | Dr. | Papri Ghosh | CSE | Professor-HOD
66 | NIT/0792 | Mr. | Amit Nigam | ECE | Assistant Professor
67 | NIT/1296 | Ms. | Aparajita Paul | ENGLISH | Assistant Professor
68 | NIT/1300 | Mr. | Debanjan Mitra | IT | Assistant Professor (Training)
69 | NIT/1302 | Mr. | Apurba Ghosh | MATH | Assistant Professor
70 | NIT/1308 | Dr. | Swastika Chakraborty (Mukhopadhyay) | ECE | Professor
71 | NIT/1312 | Dr. | Subimal Roy Barman | EE | Professor
72 | NIT/1313 | Dr. | Pushpita Roy | CSE | Assistant Professor
73 | NIT/1317 | Ms. | Marcelline Salome Gomes | BA | Assistant Professor
74 | NIT/1321 | Dr. | Sibapriya Mukherjee | CIVIL | Professor
75 | NIT/1368 | Mr. | Subhankar Dey | CIVIL | Assistant Professor
76 | NIT/1369 | Ms. | Debasmita Sen | ENGLISH | Assistant Professor
77 | NIT/1373 | Ms. | Prianka Dey | CSBS | Assistant Professor
78 | NIT/1374 | Dr. | Suman Kumar Bhattachryya | IT | Assistant Professor
79 | NIT/1379 | Mr. | Sudip Das | CA | Assistant Professor
80 | NIT/1381 | Dr. | Puja Supakar | MATH | Assistant Professor
81 | NIT/1385 | Ms. | Bingshati Mondal | CSE | Assistant Professor
82 | NIT/1397 | Ms. | Swarnali Daw | CSE | Assistant Professor
83 | NIT/1398 | Dr. | Bikas Mondal | ECS | Assistant Professor-HOD
84 | NIT/1399 | Dr. | Neepa Biswas | IT | Assistant Professor
85 | NIT/1418 | Ms. | Jayita Pal | CSE | Assistant Professor
86 | NIT/1443 | Mr. | Avishek Nath | CSE | Assistant Professor
87 | NIT/1445 | Ms. | Ipsita Dalui | CSE | Assistant Professor
88 | NIT/1450 | Mr. | Tanmoy Ghosh | CSE | Assistant Professor
89 | NIT/1458 | Mr. | Mrinmoy Guria | CSE | Assistant Professor
90 | NIT/1466 | Ms. | Sohinee Mondal | CSE | Assistant Professor
91 | NIT/1468 | Mr. | Tathagata Chatterjee | CSE - AIML | Assistant Professor
92 | NIT/1469 | Ms. | Namrata Pandey | ENGLISH | Assistant Professor
93 | NIT/1478 | Ms. | Ritwika Mukherjee | CSE | Assistant Professor
94 | NIT/1479 | Ms. | Suseta Datta | CA | Assistant Professor
95 | NIT/1484 | Mr. | Arindam Das | CSE - DS | Assistant Professor
96 | NIT/1487 | Dr. | Bimal Datta | CSE | Professor
97 | NIT/1488 | Ms. | Pritusna Banik | CST | Assistant Professor
98 | NIT/1491 | Ms. | Dishani Roy | CSE - AIML | Assistant Professor
99 | NIT/1492 | Ms. | Ritama Sharma | CSE | Assistant Professor
100 | NIT/1493 | Mr. | Dipayan Das | IT | Assistant Professor
101 | NIT/1499 | Mr. | Gopal Pramanik | CSE - AIML | Assistant Professor
102 | NIT/1502 | Dr. | Dipankar Saha | ECE | Associate Professor
103 | NIT/1522 | Dr. | Nabanita Das | CSE - DS | Associate Professor
104 | NIT/1523 | Mr. | Alok Nath Pal | CSE - AIML | Assistant Professor
105 | NIT/1529 | Dr. | Sudakshina Mandal | CA | Assistant Professor
106 | NIT/1534 | Mr. | Debabrata Maity | IT | Assistant Professor
107 | NIT/1551 | Dr. | Kishalay Bairagi | CSE - AIML | Assistant Professor
108 | NIT/1552 | Dr. | Maitrayee Chakrabarty | EE | Assistant Professor
109 | NIT/1556 | Dr. | Soma Chatterjee | CSE | Assistant Professor
110 | NIT/1557 | Ms. | Karobi Sarkar | CST | Assistant Professor
111 | NIT/1558 | Mr. | Naren Debnath | CSE - AIML | Assistant Professor
112 | NIT/1561 | Mr. | Pratap Chandra Roy | CSE - AIML | Assistant Professor
113 | NIT/1562 | Ms. | Promita Dey | CSE - AIML | Assistant Professor
114 | NIT/1563 | Mr. | Sudip Hansda | CSBS | Assistant Professor
115 | NIT/1564 | Mr. | Souvik Sharma | CIVIL | Assistant Professor
116 | NIT/1566 | Dr. | Parthasarathi De | CSE - AIML | Associate Professor-HOD
117 | NIT/1567 | Ms. | Shristi Seal | CSBS | Assistant Professor
118 | NIT/1583 | Ms. | Mousumi Mitra | CSE - DS | Assistant Professor
119 | NIT/1587 | Ms. | Mouli Das | CSE - AIML | Assistant Professor
120 | NIT/1590 | Mr. | Abhishek Banerjee | CSE - AIML | Assistant Professor
121 | NIT/1591 | Ms. | Pubali Maiti | CSE - AIML | Assistant Professor
122 | NIT/1592 | Ms. | Ankita Barua | CSE | Assistant Professor
123 | NIT/1595 | Mr. | Biswajit Patra | CSE - AIML | Assistant Professor
124 | NIT/1598 | Mr. | Debarshi Bandyopadhyay | CSE - AIML | Assistant Professor
125 | NIT/1599 | Dr. | Subhabrata Roy | ECE | Assistant Professor
126 | NIT/1601 | Dr. | Sujit Saha | ME | Assistant Professor
127 | NIT/1615 | Mr. | Arvin Bera | CSE - DS | Assistant Professor
128 | NIT/1616 | Mr. | Archi Choudhary | CSE | Assistant Professor
1 | NIT/0042 | Mr. | Amit Mitra | EE | Sr. Tech. Asst.
2 | NIT/0045 | Mr. | Partha Bhattacharyya | ME | Sr. Tech. Asst.
3 | NIT/0046 | Mr. | Partha Pratim Basu | IT | Sr. Tech. Asst.
4 | NIT/0047 | Mr. | Pran Krishna Kumar | ME | Lab Attendant
5 | NIT/0049 | Mr. | Soumen Roy | ME | Sr. Tech. Asst.
6 | NIT/0053 | Mrs. | Anusree Mondal | ECE | Sr. Tech. Asst.
7 | NIT/0063 | Mr. | Milan Banerjee | EE | Sr. Tech. Asst.
8 | NIT/0162 | Mr. | Amitava Sanfui | ME | Jr. Tech. Asst.
9 | NIT/0185 | Mrs. | Joyita Basak | CSE | Sr. Tech. Asst.
10 | NIT/0190 | Mrs. | Srabani Das (nee Roy) | ECE | Jr. Tech. Asst.
11 | NIT/0202 | Mr. | Atanu Sen | CSE | Jr. Tech. Asst.
12 | NIT/0203 | Mrs. | Haimanti Tarafdar | IT | Sr. Tech. Asst.
13 | NIT/0204 | Mr. | Prasenjit Guha | IT | Jr. Tech. Asst.
14 | NIT/0210 | Mr. | Atanu Wadadar | ECE | Jr. Tech. Asst.
15 | NIT/0226 | Mrs. | Rupa Das Gupta (Guha) | EE | Jr. Tech. Asst.
16 | NIT/0236 | Mr. | Debtosh Panda | PHYSICS | Jr. Tech. Asst.
17 | NIT/0262 | Mr. | Sudip Pal | ECE | Jr. Tech. Asst.
18 | NIT/0281 | Mrs. | Rekha Sarkar Majumder | ECE | Jr. Tech. Asst.
19 | NIT/0289 | Mr. | Bhola Nath Pal | ECE | Sr. Tech. Asst.
20 | NIT/0408 | Mr. | Arup Kumar Ghosh | EE | Jr. Tech. Asst.
21 | NIT/0418 | Mr. | Chiradeep Ghose | IT | System Admin
22 | NIT/0426 | Mr. | Karuna Ketan Karan | PHYSICS | Jr. Tech. Asst.
23 | NIT/0455 | Mr. | Bhola Guha | ME | Jr. Tech. Asst.
24 | NIT/0490 | Mr. | Barendra Kanta Chakraborty | ME | Sr. Tech. Asst.
25 | NIT/0513 | Mr. | Subhajit Roy | EE | Jr. Tech. Asst.
26 | NIT/0526 | Mr. | Avijit Dey | ECE | Jr. Tech. Asst.
27 | NIT/0534 | Mr. | Subrata Mazumder | ECE | Sr. Tech. Asst.
28 | NIT/0640 | Mr. | Nasiruddin Mondal | EE | Tech. Asst.
29 | NIT/0700 | Mr. | Rajat Saha | CIVIL | Tech. Asst.
30 | NIT/1333 | Mr. | Mahendra Kumar Sahu | CHEMISTRY | Tech. Asst.
`;

export const MOCK_EMPLOYEES: Employee[] = parseRawDataSet(rawData);