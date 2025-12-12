
> annhurst-backup.sql:65:-- Name: buses; Type: TABLE; Schema: public; Owner: david
  annhurst-backup.sql:66:--
  annhurst-backup.sql:67:
> annhurst-backup.sql:68:CREATE TABLE public.buses (
  annhurst-backup.sql:69:    id bigint NOT NULL,
  annhurst-backup.sql:70:    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:71:    bus_code text,
  annhurst-backup.sql:72:    driver bigint,
  annhurst-backup.sql:73:    letter boolean,
  annhurst-backup.sql:74:    e_payment bigint,
  annhurst-backup.sql:75:    contract_date date,
  annhurst-backup.sql:76:    agreed_date date,
  annhurst-backup.sql:77:    date_collected date,
  annhurst-backup.sql:78:    start_date date,
  annhurst-backup.sql:79:    first_pay date,
  annhurst-backup.sql:80:    initial_owe bigint,
  annhurst-backup.sql:81:    deposited bigint,
  annhurst-backup.sql:82:    t_income bigint,
  annhurst-backup.sql:83:    plate_no text,
  annhurst-backup.sql:84:    coordinator bigint
  annhurst-backup.sql:85:);
  annhurst-backup.sql:86:
  annhurst-backup.sql:87:
> annhurst-backup.sql:88:ALTER TABLE public.buses OWNER TO david;
  annhurst-backup.sql:89:
  annhurst-backup.sql:90:--
> annhurst-backup.sql:91:-- Name: buses_id_seq; Type: SEQUENCE; Schema: public; Owner: david
  annhurst-backup.sql:92:--
  annhurst-backup.sql:93:
> annhurst-backup.sql:94:CREATE SEQUENCE public.buses_id_seq
  annhurst-backup.sql:95:    START WITH 1
  annhurst-backup.sql:96:    INCREMENT BY 1
  annhurst-backup.sql:97:    NO MINVALUE
  annhurst-backup.sql:98:    NO MAXVALUE
  annhurst-backup.sql:99:    CACHE 1;
  annhurst-backup.sql:100:
  annhurst-backup.sql:101:
> annhurst-backup.sql:102:ALTER SEQUENCE public.buses_id_seq OWNER TO david;
  annhurst-backup.sql:103:
  annhurst-backup.sql:104:--
> annhurst-backup.sql:105:-- Name: buses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: david
  annhurst-backup.sql:106:--
  annhurst-backup.sql:107:
> annhurst-backup.sql:108:ALTER SEQUENCE public.buses_id_seq OWNED BY public.buses.id;
  annhurst-backup.sql:109:
  annhurst-backup.sql:110:
  annhurst-backup.sql:111:--
  annhurst-backup.sql:112:-- Name: co_subject; Type: TABLE; Schema: public; Owner: david
  annhurst-backup.sql:113:--
  annhurst-backup.sql:114:
  annhurst-backup.sql:115:CREATE TABLE public.co_subject (
  annhurst-backup.sql:116:    id bigint NOT NULL,
  annhurst-backup.sql:117:    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:118:    subject text
  annhurst-backup.sql:119:);
  annhurst-backup.sql:120:
  annhurst-backup.sql:121:
  annhurst-backup.sql:122:ALTER TABLE public.co_subject OWNER TO david;
  annhurst-backup.sql:123:
  annhurst-backup.sql:124:--
  annhurst-backup.sql:125:-- Name: co_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: david
  annhurst-backup.sql:126:--
  annhurst-backup.sql:127:
  annhurst-backup.sql:128:CREATE SEQUENCE public.co_subject_id_seq
  annhurst-backup.sql:129:    START WITH 1
  annhurst-backup.sql:130:    INCREMENT BY 1
  annhurst-backup.sql:131:    NO MINVALUE
  annhurst-backup.sql:132:    NO MAXVALUE
  annhurst-backup.sql:133:    CACHE 1;
  annhurst-backup.sql:134:
  annhurst-backup.sql:135:
  annhurst-backup.sql:136:ALTER SEQUENCE public.co_subject_id_seq OWNER TO david;
  annhurst-backup.sql:137:
  annhurst-backup.sql:138:--
  annhurst-backup.sql:139:-- Name: co_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: david
  annhurst-backup.sql:140:--
  annhurst-backup.sql:141:
  annhurst-backup.sql:142:ALTER SEQUENCE public.co_subject_id_seq OWNED BY public.co_subject.id;
  annhurst-backup.sql:143:
  annhurst-backup.sql:144:
  annhurst-backup.sql:145:--
  annhurst-backup.sql:146:-- Name: contact; Type: TABLE; Schema: public; Owner: david
  annhurst-backup.sql:147:--
  annhurst-backup.sql:148:
  annhurst-backup.sql:149:CREATE TABLE public.contact (
  annhurst-backup.sql:150:    id bigint NOT NULL,
  annhurst-backup.sql:151:    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:152:    coordinator bigint,
  annhurst-backup.sql:153:    driver bigint,
  annhurst-backup.sql:154:    subject bigint,
  annhurst-backup.sql:155:    transaction_date date,
  annhurst-backup.sql:156:    message text,
  annhurst-backup.sql:157:    is_starred boolean,
  annhurst-backup.sql:158:    is_read boolean,
> annhurst-backup.sql:313:-- Name: inspection; Type: TABLE; Schema: public; Owner: david
  annhurst-backup.sql:314:--
  annhurst-backup.sql:315:
> annhurst-backup.sql:316:CREATE TABLE public.inspection (
  annhurst-backup.sql:317:    id bigint NOT NULL,
  annhurst-backup.sql:318:    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:319:    month date,
  annhurst-backup.sql:320:    coordinator text,
  annhurst-backup.sql:321:    bus bigint,
  annhurst-backup.sql:322:    pdf text,
  annhurst-backup.sql:323:    video text,
  annhurst-backup.sql:324:    code text,
  annhurst-backup.sql:325:    d_uploaded date,
  annhurst-backup.sql:326:    video_gp text,
  annhurst-backup.sql:327:    plate_number text,
  annhurst-backup.sql:328:    bus_uploaded text,
  annhurst-backup.sql:329:    issue text,
  annhurst-backup.sql:330:    both_vid_pdf text,
> annhurst-backup.sql:331:    inspection_completed_by text,
  annhurst-backup.sql:332:    issues text
  annhurst-backup.sql:333:);
  annhurst-backup.sql:334:
  annhurst-backup.sql:335:
> annhurst-backup.sql:336:ALTER TABLE public.inspection OWNER TO david;
  annhurst-backup.sql:337:
  annhurst-backup.sql:338:--
> annhurst-backup.sql:339:-- Name: inspection_id_seq; Type: SEQUENCE; Schema: public; Owner: david
  annhurst-backup.sql:340:--
  annhurst-backup.sql:341:
> annhurst-backup.sql:342:CREATE SEQUENCE public.inspection_id_seq
  annhurst-backup.sql:343:    START WITH 1
  annhurst-backup.sql:344:    INCREMENT BY 1
  annhurst-backup.sql:345:    NO MINVALUE
  annhurst-backup.sql:346:    NO MAXVALUE
  annhurst-backup.sql:347:    CACHE 1;
  annhurst-backup.sql:348:
  annhurst-backup.sql:349:
> annhurst-backup.sql:350:ALTER SEQUENCE public.inspection_id_seq OWNER TO david;
  annhurst-backup.sql:351:
  annhurst-backup.sql:352:--
> annhurst-backup.sql:353:-- Name: inspection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: david
  annhurst-backup.sql:354:--
  annhurst-backup.sql:355:
> annhurst-backup.sql:356:ALTER SEQUENCE public.inspection_id_seq OWNED BY public.inspection.id;
  annhurst-backup.sql:357:
  annhurst-backup.sql:358:
  annhurst-backup.sql:359:--
  annhurst-backup.sql:360:-- Name: pages; Type: TABLE; Schema: public; Owner: david
  annhurst-backup.sql:361:--
  annhurst-backup.sql:362:
  annhurst-backup.sql:363:CREATE TABLE public.pages (
  annhurst-backup.sql:364:    id bigint NOT NULL,
  annhurst-backup.sql:365:    title text NOT NULL,
  annhurst-backup.sql:366:    slug text NOT NULL,
  annhurst-backup.sql:367:    text text NOT NULL,
  annhurst-backup.sql:368:    meta_description text,
  annhurst-backup.sql:369:    is_published boolean DEFAULT false,
  annhurst-backup.sql:370:    views integer DEFAULT 0 NOT NULL,
  annhurst-backup.sql:371:    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:372:    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:373:    hero_big_black text,
  annhurst-backup.sql:374:    hero_big_primary text,
  annhurst-backup.sql:375:    hero_text text,
  annhurst-backup.sql:376:    hero_primary_button text,
  annhurst-backup.sql:377:    hero_secondary_button text,
  annhurst-backup.sql:378:    hero_year text,
  annhurst-backup.sql:379:    hero_year_span text,
  annhurst-backup.sql:380:    hero_100 text,
  annhurst-backup.sql:381:    hero_100_span text,
  annhurst-backup.sql:382:    hero_24 text,
  annhurst-backup.sql:383:    hero_24_span text,
  annhurst-backup.sql:384:    body_heading text,
  annhurst-backup.sql:385:    body_sub_heading text,
  annhurst-backup.sql:386:    body_first_text text,
  annhurst-backup.sql:387:    body_second_text text,
  annhurst-backup.sql:388:    body_heading2 text,
  annhurst-backup.sql:389:    body_sub_heading2 text,
  annhurst-backup.sql:390:    body_heading3 text,
  annhurst-backup.sql:391:    body_sub_heading3 text,
  annhurst-backup.sql:392:    body_heading4 text,
  annhurst-backup.sql:393:    body_sub_heading4 text,
  annhurst-backup.sql:394:    box_text text,
  annhurst-backup.sql:395:    box_head text,
  annhurst-backup.sql:396:    box_text2 text,
  annhurst-backup.sql:397:    box_head2 text,
  annhurst-backup.sql:398:    box_text3 text,
  annhurst-backup.sql:399:    box_head3 text,
  annhurst-backup.sql:400:    box_text4 text,
  annhurst-backup.sql:401:    box_head4 text,
  annhurst-backup.sql:402:    box_text5 text,
  annhurst-backup.sql:403:    box_head5 text,
  annhurst-backup.sql:404:    box_text6 text,
  annhurst-backup.sql:405:    box_head6 text,
  annhurst-backup.sql:406:    box_text7 text,
> annhurst-backup.sql:472:    inspection text,
  annhurst-backup.sql:473:    completed_by text
  annhurst-backup.sql:474:);
  annhurst-backup.sql:475:
  annhurst-backup.sql:476:
  annhurst-backup.sql:477:ALTER TABLE public.payment OWNER TO david;
  annhurst-backup.sql:478:
  annhurst-backup.sql:479:--
  annhurst-backup.sql:480:-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: david
  annhurst-backup.sql:481:--
  annhurst-backup.sql:482:
  annhurst-backup.sql:483:CREATE SEQUENCE public.payment_id_seq
  annhurst-backup.sql:484:    START WITH 1
  annhurst-backup.sql:485:    INCREMENT BY 1
  annhurst-backup.sql:486:    NO MINVALUE
  annhurst-backup.sql:487:    NO MAXVALUE
  annhurst-backup.sql:488:    CACHE 1;
  annhurst-backup.sql:489:
  annhurst-backup.sql:490:
  annhurst-backup.sql:491:ALTER SEQUENCE public.payment_id_seq OWNER TO david;
  annhurst-backup.sql:492:
  annhurst-backup.sql:493:--
  annhurst-backup.sql:494:-- Name: payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: david
  annhurst-backup.sql:495:--
  annhurst-backup.sql:496:
  annhurst-backup.sql:497:ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;
  annhurst-backup.sql:498:
  annhurst-backup.sql:499:
  annhurst-backup.sql:500:--
  annhurst-backup.sql:501:-- Name: settings; Type: TABLE; Schema: public; Owner: david
  annhurst-backup.sql:502:--
  annhurst-backup.sql:503:
  annhurst-backup.sql:504:CREATE TABLE public.settings (
  annhurst-backup.sql:505:    id bigint NOT NULL,
  annhurst-backup.sql:506:    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  annhurst-backup.sql:507:    phone text[],
  annhurst-backup.sql:508:    email text[],
  annhurst-backup.sql:509:    address text,
  annhurst-backup.sql:510:    logo text,
  annhurst-backup.sql:511:    footer_write text,
  annhurst-backup.sql:512:    footer_head text,
  annhurst-backup.sql:513:    footer_head2 text,
  annhurst-backup.sql:514:    services text[],
  annhurst-backup.sql:515:    bottom_left text,
  annhurst-backup.sql:516:    bottom_right text[],
  annhurst-backup.sql:517:    logo_blk text
  annhurst-backup.sql:518:);
  annhurst-backup.sql:519:
  annhurst-backup.sql:520:
  annhurst-backup.sql:521:ALTER TABLE public.settings OWNER TO david;
  annhurst-backup.sql:522:
> annhurst-backup.sql:623:-- Name: buses id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:624:--
  annhurst-backup.sql:625:
> annhurst-backup.sql:626:ALTER TABLE ONLY public.buses ALTER COLUMN id SET DEFAULT 
nextval('public.buses_id_seq'::regclass);
  annhurst-backup.sql:627:
  annhurst-backup.sql:628:
  annhurst-backup.sql:629:--
  annhurst-backup.sql:630:-- Name: co_subject id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:631:--
  annhurst-backup.sql:632:
  annhurst-backup.sql:633:ALTER TABLE ONLY public.co_subject ALTER COLUMN id SET DEFAULT 
nextval('public.co_subject_id_seq'::regclass);
  annhurst-backup.sql:634:
  annhurst-backup.sql:635:
  annhurst-backup.sql:636:--
  annhurst-backup.sql:637:-- Name: contact id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:638:--
  annhurst-backup.sql:639:
  annhurst-backup.sql:640:ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT 
nextval('public.contact_id_seq'::regclass);
  annhurst-backup.sql:641:
  annhurst-backup.sql:642:
  annhurst-backup.sql:643:--
  annhurst-backup.sql:644:-- Name: contact_us id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:645:--
  annhurst-backup.sql:646:
  annhurst-backup.sql:647:ALTER TABLE ONLY public.contact_us ALTER COLUMN id SET DEFAULT 
nextval('public.contact_us_id_seq'::regclass);
  annhurst-backup.sql:648:
  annhurst-backup.sql:649:
  annhurst-backup.sql:650:--
  annhurst-backup.sql:651:-- Name: coordinators id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:652:--
  annhurst-backup.sql:653:
  annhurst-backup.sql:654:ALTER TABLE ONLY public.coordinators ALTER COLUMN id SET DEFAULT 
nextval('public.coordinators_id_seq'::regclass);
  annhurst-backup.sql:655:
  annhurst-backup.sql:656:
  annhurst-backup.sql:657:--
  annhurst-backup.sql:658:-- Name: driver id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:659:--
  annhurst-backup.sql:660:
  annhurst-backup.sql:661:ALTER TABLE ONLY public.driver ALTER COLUMN id SET DEFAULT 
nextval('public.driver_id_seq'::regclass);
  annhurst-backup.sql:662:
  annhurst-backup.sql:663:
  annhurst-backup.sql:664:--
> annhurst-backup.sql:665:-- Name: inspection id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:666:--
  annhurst-backup.sql:667:
> annhurst-backup.sql:668:ALTER TABLE ONLY public.inspection ALTER COLUMN id SET DEFAULT 
nextval('public.inspection_id_seq'::regclass);
  annhurst-backup.sql:669:
  annhurst-backup.sql:670:
  annhurst-backup.sql:671:--
  annhurst-backup.sql:672:-- Name: pages id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:673:--
  annhurst-backup.sql:674:
  annhurst-backup.sql:675:ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT 
nextval('public.pages_id_seq'::regclass);
  annhurst-backup.sql:676:
  annhurst-backup.sql:677:
  annhurst-backup.sql:678:--
  annhurst-backup.sql:679:-- Name: payment id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:680:--
  annhurst-backup.sql:681:
  annhurst-backup.sql:682:ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT 
nextval('public.payment_id_seq'::regclass);
  annhurst-backup.sql:683:
  annhurst-backup.sql:684:
  annhurst-backup.sql:685:--
  annhurst-backup.sql:686:-- Name: settings id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:687:--
  annhurst-backup.sql:688:
  annhurst-backup.sql:689:ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT 
nextval('public.settings_id_seq'::regclass);
  annhurst-backup.sql:690:
  annhurst-backup.sql:691:
  annhurst-backup.sql:692:--
  annhurst-backup.sql:693:-- Name: subject id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:694:--
  annhurst-backup.sql:695:
  annhurst-backup.sql:696:ALTER TABLE ONLY public.subject ALTER COLUMN id SET DEFAULT 
nextval('public.subject_id_seq'::regclass);
  annhurst-backup.sql:697:
  annhurst-backup.sql:698:
  annhurst-backup.sql:699:--
  annhurst-backup.sql:700:-- Name: users id; Type: DEFAULT; Schema: public; Owner: david
  annhurst-backup.sql:701:--
  annhurst-backup.sql:702:
  annhurst-backup.sql:703:ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT 
nextval('public.users_id_seq'::regclass);
  annhurst-backup.sql:704:
  annhurst-backup.sql:705:
  annhurst-backup.sql:706:--
  annhurst-backup.sql:707:-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:708:--
  annhurst-backup.sql:709:
  annhurst-backup.sql:710:COPY public.admins (id, email, role, created_at, name, avatar, password, banned) FROM stdin;
  annhurst-backup.sql:711:1	admin@annhurst-gsl.com	admin	2025-11-02 21:57:41.591+00	Administrator	\N	
$2b$10$JJHyZZ/vQal34Pt5xRWIt.ykAhAKogNDynmFApkTJrJbb1BM.eSly	f
  annhurst-backup.sql:712:3	deboraheidehen@gmail.com	viewer	2025-11-02 21:57:41.597+00	Deborah	\N	
$2b$10$LL1d5QQ/ccuWgW5nr6SCl.7C5JR3RAElyomB6c4cjFt.vtG.sKZ5y	f
  annhurst-backup.sql:713:4	cereoah@annhurst-gsl.com	editor	2025-11-25 15:15:50.137+00	Cleophas Ereoah	\N	
$2b$10$EE06e3rRgVVyvAM8dfszhOsh2/mlEbARaT9wO2oUYOZFA7sJHvxbK	f
  annhurst-backup.sql:714:2	dutibe@annhurst-gsl.com	admin	2025-11-02 21:57:41.595+00	David	\N	
$2b$10$YY/LB53hHkO5rXhDaM8a5uLJF9AjS2LWKX6I633CZxICiXVuTz33K	f
  annhurst-backup.sql:715:\.
  annhurst-backup.sql:716:
  annhurst-backup.sql:717:
  annhurst-backup.sql:718:--
> annhurst-backup.sql:719:-- Data for Name: buses; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:720:--
  annhurst-backup.sql:721:
> annhurst-backup.sql:722:COPY public.buses (id, created_at, bus_code, driver, letter, e_payment, contract_date, 
agreed_date, date_collected, start_date, first_pay, initial_owe, deposited, t_income, plate_no, coordinator) FROM 
stdin;
  annhurst-backup.sql:723:1	2025-09-03 15:53:51+00	L07	3	f	60000	2025-04-07	2027-01-03	2025-04-12	2025-04-14	
2025-04-20	5600000	250000	2350000	KTU 724 YK	4
  annhurst-backup.sql:724:3	2025-09-03 16:40:53+00	M01	2	f	65000	2025-06-20	2027-03-14	2025-07-11	2025-07-14	
2025-07-20	5863000	300000	783000	KTU 211 YL	1
  annhurst-backup.sql:725:4	2025-09-03 16:46:19+00	L08	1	f	60000	2025-04-07	2027-01-03	2025-04-12	2025-04-14	
2025-04-20	5600000	250000	1685000	KTU 725 YK	4
  annhurst-backup.sql:726:5	2025-09-09 19:14:12.828486+00	TR	5	f	50000	2023-08-28	2024-12-29	2023-08-30	2023-08-28	
2023-09-10	3500000	100000	2825000	GGE 257 YH	2
  annhurst-backup.sql:727:6	2025-09-09 19:15:53.034765+00	I03	4	f	50000	2024-10-04	2025-11-30	2024-10-04	2024-10-13	
2024-11-03	2400000	0	1820000	GGE 413 YH	4
  annhurst-backup.sql:728:7	2025-09-09 20:23:13.234599+00	J03	6	f	50000	2025-02-17	2025-12-07	2025-02-18	2025-02-27	
2025-03-02	2000000	0	1350000	KRD 464 YH	4
  annhurst-backup.sql:729:8	2025-09-09 20:24:14.559983+00	J09	7	f	40000	2024-10-05	2026-07-03	2024-08-26	2024-08-26	
2024-09-01	2000000	0	1845000	FST 212YH	3
  annhurst-backup.sql:730:9	2025-09-09 20:25:44.945142+00	K02	8	f	40000	2024-10-04	2026-01-11	2024-10-04	2024-10-13	
2024-10-20	2670000	100000	1940000	LSD 536 YJ	1
  annhurst-backup.sql:731:10	2025-09-09 20:26:21.503686+00	K04	9	f	50000	2025-05-08	2026-03-12	2025-05-10	2025-05-25	
2025-05-25	2000000	0	800000	EKY 410YJ	1
  annhurst-backup.sql:732:11	2025-09-09 20:27:04.019718+00	K05	10	f	50000	2025-05-11	2026-03-23	2025-05-11	2025-05-18	
2025-05-19	2300000	0	800000	LSD 537 YJ	3
  annhurst-backup.sql:733:12	2025-09-09 20:27:39.227802+00	K06	11	f	50000	2024-01-31	2025-10-26	2024-02-02	2024-02-05	
2024-02-10	3700000	150000	3430000	LSD 882YJ	1
  annhurst-backup.sql:734:13	2025-09-09 20:28:16.693386+00	K07	12	f	50000	2025-01-13	2025-11-16	2025-01-21	2025-01-26	
2025-02-03	2200000	100000	1700000	LSD 881YJ	1
  annhurst-backup.sql:735:14	2025-09-09 20:28:58.421118+00	K08	13	t	70000	2025-02-07	2025-12-07	2025-02-07	2025-02-10	
2025-02-23	2200000	100000	1520000	FKJ 142YJ	4
  annhurst-backup.sql:736:15	2025-09-09 20:29:29.30857+00	K09	14	t	60000	2024-01-25	2025-11-09	2024-02-19	2024-02-19	
2024-02-26	3700000	150000	3390000	FKJ 141YJ	1
  annhurst-backup.sql:737:16	2025-09-09 20:30:06.35824+00	K10	15	f	40000	2024-03-08	2025-12-07	2024-03-11	2024-03-12	
2024-03-17	3700000	125000	3235000	FST 576YJ	4
  annhurst-backup.sql:738:17	2025-09-09 20:30:40.627265+00	K11	16	t	55000	2024-03-11	2025-12-14	2024-03-11	2024-03-12	
2024-03-18	3700000	125000	3219000	FST 579YJ	1
  annhurst-backup.sql:739:18	2025-09-09 20:31:07.618633+00	K12	17	t	80000	2025-02-07	2025-12-07	2025-02-07	2025-02-10	
2025-02-17	2200000	100000	1500000	FST 578YJ	3
  annhurst-backup.sql:740:19	2025-09-09 20:31:40.229398+00	K13	18	f	40000	2024-03-09	2025-11-16	2024-03-09	2024-03-11	
2024-03-17	3600000	150000	3270000	FST 581YJ	3
  annhurst-backup.sql:741:20	2025-09-11 10:01:04.332924+00	K14	19	t	50000	2024-03-09	2025-11-16	2024-03-09	2024-03-11	
2024-03-18	3600000	150000	3220000	FST 580YJ	1
  annhurst-backup.sql:742:21	2025-09-11 10:35:29.016175+00	K15	20	f	50000	2025-01-23	2025-12-21	2025-01-27	2025-02-03	
2025-02-10	2600000	100000	1600000	FST 686YJ	1
  annhurst-backup.sql:743:22	2025-09-11 10:54:44.876506+00	K16	21	f	50000	2024-03-01	2025-12-21	2024-04-05	2024-04-08	
2024-04-15	3600000	150000	3090000	FST 685YJ	1
  annhurst-backup.sql:744:23	2025-09-11 11:02:00.295453+00	K17	22	f	40000	2024-04-19	2026-01-18	2024-04-23	2024-04-24	
2024-04-29	3700000	150000	3045000	AGL 52YJ	1
  annhurst-backup.sql:745:24	2025-09-11 11:05:54.392229+00	K18	23	f	40000	2024-04-19	2026-01-04	2024-04-24	2024-04-25	
2024-04-29	3600000	150000	2765000	AGL 50YJ	1
  annhurst-backup.sql:746:25	2025-09-11 11:09:33.036853+00	L01	24	f	60000	2025-02-13	2026-11-22	2025-02-14	2025-02-17	
2025-02-23	5700000	250000	1990000	MUS 950YH	4
  annhurst-backup.sql:747:26	2025-09-11 11:12:16.921415+00	L02	25	f	60000	2025-02-09	2026-11-15	2025-02-09	2025-02-10	
2025-02-15	5600000	249999	2050000	MUS 949YH	3
  annhurst-backup.sql:748:27	2025-09-11 11:15:15.837171+00	L03	26	f	60000	2025-03-03	2026-12-20	2025-03-13	2025-03-17	
2025-03-23	5700000	250000	1750000	KTU 720YK	3
  annhurst-backup.sql:749:28	2025-09-11 11:17:55.761468+00	L04	27	f	60000	2025-02-14	2026-12-09	2025-03-14	2025-02-17	
2025-03-23	5600000	250000	1750000	KTU 721YK	4
  annhurst-backup.sql:750:29	2025-09-11 11:25:51.917493+00	L05	28	f	60000	2025-03-03	2026-12-20	2025-03-14	2025-03-17	
2025-03-23	5700000	250000	1750000	KTU 722YK	3
  annhurst-backup.sql:751:30	2025-09-11 11:29:16.222978+00	L06	29	f	60000	2025-03-03	2026-12-09	2025-03-14	2025-02-17	
2025-03-23	5600000	250000	1750000	KTU 723YK	3
  annhurst-backup.sql:752:31	2025-09-11 11:33:49.639145+00	L09	30	f	60000	2025-03-03	2026-12-20	2025-03-14	2025-03-17	
2025-03-23	5700000	250000	1570000	SMK 834YK	3
  annhurst-backup.sql:753:32	2025-09-11 11:37:14.598275+00	L10	31	f	60000	2025-03-03	2027-03-07	2025-06-01	2025-03-16	
2025-06-08	5700000	250000	1070000	KRD 741 YL	3
  annhurst-backup.sql:754:33	2025-09-11 11:39:56.306258+00	L11	32	f	60000	2025-03-03	2027-03-07	2025-05-31	2025-06-02	
2025-06-08	5700000	250000	1070000	EKY 427 YL	3
  annhurst-backup.sql:755:34	2025-09-11 11:44:27.049009+00	L12	33	f	60000	2025-05-04	2027-03-07	2025-05-31	2025-06-02	
2025-06-08	5700000	250000	1070000	KRD 740 YL	3
  annhurst-backup.sql:756:35	2025-09-11 11:54:49.701549+00	L13	34	f	60000	2025-03-30	2027-03-07	2025-03-31	2025-06-02	
2025-06-08	5700000	250000	1070000	EKY 428 YL	4
  annhurst-backup.sql:757:36	2025-09-11 11:57:58.259216+00	L14	35	f	60000	2025-05-25	2027-03-07	2025-05-31	2025-06-02	
2025-06-08	5700000	250000	1070000	KRD 742 YL	4
  annhurst-backup.sql:758:37	2025-09-11 12:16:24.549921+00	L15	36	f	65000	2025-06-01	2027-02-07	2025-06-01	2025-06-02	
2025-06-26	5900000	400000	1090000	KRD 739 YL	4
  annhurst-backup.sql:759:38	2025-09-11 12:20:39.390789+00	L16	37	f	60000	2025-05-31	2027-02-21	2025-05-31	2025-06-02	
2025-06-08	5600000	250000	1070000	KRD 743 YL	3
  annhurst-backup.sql:760:39	2025-09-11 12:24:54.033635+00	L17	38	f	60000	2025-05-31	2027-02-21	2025-06-02	2025-06-02	
2025-06-08	5600000	250000	1070000	KRD 744 YL	4
  annhurst-backup.sql:761:40	2025-09-11 12:27:30.614012+00	L18	39	f	65000	2025-05-31	2027-01-31	2025-06-01	2025-06-02	
2025-06-08	5900000	300000	1185000	EKY 429 YL	4
  annhurst-backup.sql:762:41	2025-09-11 12:30:30.753594+00	M02	40	f	65000	2025-06-13	2027-03-21	2025-07-11	2025-07-14	
2025-07-20	6000000	300000	845000	KTU 213 YL	1
  annhurst-backup.sql:763:42	2025-09-11 12:32:46.532898+00	M03	41	f	65000	2025-06-26	2027-04-11	2025-08-01	2025-08-04	
\N	6000000	300000	625000	AKD 885 YL	3
  annhurst-backup.sql:764:43	2025-09-12 09:19:55.289516+00	M04	42	f	65000	2025-06-05	2027-03-21	2025-07-14	2025-07-14	
2025-07-18	6000000	300000	820000	KTU 210 YL	1
  annhurst-backup.sql:765:44	2025-09-12 09:22:19.542034+00	M05	43	f	65000	2025-06-04	2027-04-11	2025-07-26	2025-07-28	
2025-08-03	6000000	300000	665000	KTU 172 YL	3
  annhurst-backup.sql:766:45	2025-09-12 09:25:06.916746+00	M06	44	f	65000	2025-03-27	2027-03-28	2025-07-26	2025-07-28	
2025-07-20	6000000	300000	795000	KTU 209 YL	3
  annhurst-backup.sql:767:46	2025-09-12 09:27:34.998531+00	M07	45	f	65000	2025-06-30	2027-03-28	2025-07-26	2025-07-28	
2025-08-02	6000000	300000	665000	KTU 173 YL	3
  annhurst-backup.sql:768:47	2025-09-12 09:29:51.297426+00	M08	46	f	65000	2025-06-23	2027-04-11	2025-07-26	2025-07-28	
2025-08-02	6000000	300000	665000	KTU 171 YL	4
  annhurst-backup.sql:769:48	2025-09-12 09:32:39.188793+00	M09	47	f	65000	2025-06-23	2027-04-11	2025-07-26	2025-07-28	
2025-08-01	6000000	300000	665000	KTU 144 YL	4
  annhurst-backup.sql:770:49	2025-09-12 09:35:40.459571+00	M10	48	f	65000	2025-06-04	2027-03-14	2025-07-11	2025-07-14	
2025-07-20	5900000	300000	820000	KTU 212 YL	1
  annhurst-backup.sql:771:50	2025-09-12 09:37:41.955274+00	M11	49	f	65000	2025-07-02	2027-04-04	2025-08-01	2025-08-04	
2025-08-10	5900000	300000	625000	AKD 887 YL	4
  annhurst-backup.sql:772:51	2025-09-12 09:40:26.614582+00	M12	50	f	65000	2025-06-30	2027-08-09	2025-08-30	2025-09-07	
2025-09-07	6000000	300000	365000	AKD 276 YL	4
> annhurst-backup.sql:914:-- Data for Name: inspection; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:915:--
  annhurst-backup.sql:916:
> annhurst-backup.sql:917:COPY public.inspection (id, created_at, month, coordinator, bus, pdf, video, code, 
d_uploaded, video_gp, plate_number, bus_uploaded, issue, both_vid_pdf, inspection_completed_by, issues) FROM stdin;
> annhurst-backup.sql:918:1	2025-12-02 13:41:53.407+00	2025-11-01	Emmanuel	3	
/uploads/4b7cb6ec-5877-4e69-89d1-31d30ddcf8ed-M1.pdf	/uploads/inspections/127c4196-0959-423b-9f7f-89bece70285d.mp4	
/uploads/inspections/781e3bd7-981a-43d0-b469-8b59e773bec2.webm	2025-12-02	\N	KTU 211 YL	\N	None	YES	Emmanuel	No issues
> annhurst-backup.sql:919:2	2025-12-02 15:11:43.205+00	2025-11-01	Emmanuel	9	\N	
/uploads/inspections/de7cc55a-de31-4617-91a1-953eb53525d3.webm	
/uploads/inspections/56e51359-bc9e-47a7-9183-b34dd3f94d3b.webm	2025-12-02	\N	LSD 536 YJ	\N	No	NO	Emmanuel	None
  annhurst-backup.sql:920:\.
  annhurst-backup.sql:921:
  annhurst-backup.sql:922:
  annhurst-backup.sql:923:--
  annhurst-backup.sql:924:-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:925:--
  annhurst-backup.sql:926:
  annhurst-backup.sql:927:COPY public.pages (id, title, slug, text, meta_description, is_published, views, created_at, 
updated_at, hero_big_black, hero_big_primary, hero_text, hero_primary_button, hero_secondary_button, hero_year, 
hero_year_span, hero_100, hero_100_span, hero_24, hero_24_span, body_heading, body_sub_heading, body_first_text, 
body_second_text, body_heading2, body_sub_heading2, body_heading3, body_sub_heading3, body_heading4, 
body_sub_heading4, box_text, box_head, box_text2, box_head2, box_text3, box_head3, box_text4, box_head4, box_text5, 
box_head5, box_text6, box_head6, box_text7, box_head7, box_text8, box_head8, box_text9, box_head9, team_img, 
team_text, team_role, team_img2, team_text2, team_role2, team_img3, team_text3, team_role3, section_head, 
section_text, section_primary_btn, section_secondary_btn, hp, fm) FROM stdin;
> annhurst-backup.sql:928:2	Services	services	From 12% APR	Comprehensive bus financing and management services	t	10	
2025-08-12 01:25:38.91574+00	2025-08-12 01:25:38.91574+00	Our	Services	Comprehensive bus financing solutions designed 
to help your transportation business grow and succeed	Get Started	Learn More	Custom Pricing	\N	\N	\N	\N	\N	Complete 
financing solutions	What We Offer	From initial consultation to final payment, we provide end-to-end support for all 
your bus financing needs.	\N	Simple 4-step process	How It Works	Benefits that set us apart	Why Choose Us	We're here to 
help you succeed	Additional Support	Our flagship service offering flexible higher purchase agreements for buses of all 
sizes and types. Perfect for businesses looking to expand their fleet while maintaining operational cash flow.	Higher 
Purchase	Comprehensive fleet management services to help you optimize operations, reduce costs, and maximize the value 
of your bus fleet investment.	Fleet Management	Submit your application with basic business information and 
requirements	Application	Our team reviews your application and conducts necessary assessments	Review	Receive approval 
and finalize terms of your financing agreement	Approval	Get your buses and start growing your transportation business	
Funding	We offer some of the most competitive interest rates in the industry, helping you save money on your 
financing.	Competitive Rates	Our streamlined process ensures quick approval and funding, so you can get your buses on 
the road faster.	Fast Processing	Your financial information is protected with bank-level security, and our services 
are backed by years of experience.	Secure & Reliable	\N	We help you gather and organize all necessary documents for a 
smooth application process.	Documentation Support	\N	Our customer support team is available around the clock to answer 
your questions and provide assistance.	24/7 Support	\N	Get expert advice on fleet expansion, route optimization, and 
business growth strategies.	Business Consulting	Ready to get started?	Contact our team today to discuss your bus 
financing needs and discover how we can help you grow your transportation business.	Contact Us	Learn More	
{"Competitive interest rates","Flexible payment terms","Quick approval process","No hidden fees"}	{"Maintenance 
scheduling","Insurance management","Performance tracking","Cost optimization"}
> annhurst-backup.sql:929:4	Home	home	Investment Success	Leading provider of bus financing and fleet management 
services	t	10	2025-08-12 01:25:38.91574+00	2025-08-12 01:25:38.91574+00	Bus Higher Purchase	Solutions	Annhurst 
Transport Service Limited provides comprehensive bus financing solutions for transportation businesses. Get your fleet 
on the road with our flexible higher purchase options.	Explore Services	Get Started	5+	Years of excellence	100%	
On-Time-Payments	24/7	Customer Support	Everything you need for your bus fleet	Why Choose Us	We understand the 
challenges of running a transportation business. That's why we've designed our services to be flexible, reliable, and 
tailored to your needs.	High Returns	Comprehensive bus financing solutions	Our Services	Trusted by transportation 
businesses	Join hundreds of successful companies who have grown their fleet with us	\N	\N	Our secure financing options 
ensure you get the best rates while maintaining financial stability for your business.	Secure Financing	Fast approval 
process with minimal documentation requirements. Get your buses on the road in record time.	Quick Approval	Our team of 
transportation finance experts is here to guide you through every step of the process.	Expert Support	Flexible higher 
purchase agreements with competitive interest rates. Own your buses while maintaining cash flow for operations.	Higher 
Purchase	Comprehensive fleet management services including maintenance scheduling, insurance, and operational support.	
Fleet Management	Buses Financed	200+	Happy Clients	100+	Years Experience	5+	Success Rate	98%	Bus Investment ROI	
Customer Satisfaction	98%	\N	\N	\N	\N	\N	\N	Ready to expand your fleet?	Get in touch with our team today and discover 
how we can help you grow your transportation business.	Contact Us	Learn More	\N	\N
> annhurst-backup.sql:930:1	About Us	about	Our impact in numbers	Learn about our company mission and values	t	10	
2025-08-12 01:25:38.91574+00	2025-08-12 01:25:38.91574+00	About	Annhurst Transport	Leading the way in bus higher 
purchase solutions across Nigeria and beyond	\N	\N	\N	\N	\N	\N	\N	\N	Our Story	\N	Founded with a vision to democratize 
investment opportunities in Nigeria, Annhurst Transport Services Limited has been at the forefront of providing 
accessible, profitable investment options for individuals and businesses across the country.	With over 5 years of 
proven excellence, we have built a reputation for reliability, transparency, and consistent returns. Our expertise 
spans across transportation, real estate, and business expansion sectors, making us your one-stop solution for 
investment opportunities.	Driving growth in transportation	Our Purpose	The principles that guide us	Our Values	Meet 
the experts behind our success	Our Team	To provide accessible, reliable, and innovative financing solutions that 
empower transportation businesses to grow their fleets and expand their operations, contributing to economic 
development across Nigeria.	Our Mission	To be the leading provider of transportation financing solutions in West 
Africa, recognized for our innovation, reliability, and commitment to customer success.	Our Vision	We put our 
customers at the heart of everything we do, ensuring their success is our priority.	Customer First	We strive for 
excellence in all aspects of our business, from customer service to financial solutions.	Excellence	We continuously 
innovate our services to meet the evolving needs of the transportation industry.	Innovation	Years in Business	5+	Buses 
Financed	200+	Satisfied Clients	100+	Team Members	25+	\N	Strategic leadership and vision	Management Team	\N	
Specialized in transportation financing	Finance Experts	\N	Dedicated to your success	Customer Support	\N	Our team of 
experienced professionals brings together decades of expertise in transportation finance, customer service, and 
business development.	\N	\N	\N	\N
> annhurst-backup.sql:931:3	Contact	contact	Located in the heart of Lagos business district, our office is easily 
accessible and ready to welcome you.	Contact information and inquiry form	t	10	2025-08-12 01:25:38.915+00	2025-08-12 
01:25:38.915+00	Contact	Us	Ready to expand your bus fleet? Get in touch with our team today and discover how we can 
help you grow your transportation business.	Call Now	Email	I have a bus	+234 707 857 1856	+234 809 318 3556	
customerservices@annhurst-gsl.com	\N	Info@annhurst-gsl.com	Send us a message	\N	Full Name *	\N	Get in touch	\N	Visit 
our office	Find Us	Frequently asked questions	FAQ	You'll need your business registration documents, financial 
statements, driver's license, and proof of income. Our team will provide a complete checklist during your initial 
consultation.	What documents do I need to apply for bus financing?	Typically, we can provide approval within 2-3 
business days for complete applications. The entire process from application to funding usually takes 1-2 weeks.	How 
long does the approval process take?	We finance all types of buses including minibuses, coaches, school buses, and 
luxury buses. We work with both new and used vehicles from reputable manufacturers.	What types of buses do you 
finance?	Yes, we offer refinancing solutions for existing bus loans. This can help you get better rates or more 
favorable terms. Contact us to discuss your options.	Do you offer refinancing options?	Our customer support team is 
available to help you with urgent inquiries and quick questions about our services.	Need immediate assistance?	Send 
Message	Monday - Friday: 8:00 AM - 6:00 PM	Saturday: 9:00 AM - 2:00 PM	Sunday: Closed	13 Association Avenue	Shangisha, 
Ketu	Lagos, Nigeria	Email Address *	Phone Number	Company Name	Service of Interest	Message *	\N	\N	\N	\N	\N	\N	\N	\N	\N	
{}	{}
  annhurst-backup.sql:932:\.
  annhurst-backup.sql:933:
  annhurst-backup.sql:934:
  annhurst-backup.sql:935:--
  annhurst-backup.sql:936:-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:937:--
  annhurst-backup.sql:938:
> annhurst-backup.sql:939:COPY public.payment (id, created_at, week, coordinator, bus, p_week, receipt, amount, 
sender, payment_day, payment_date, pay_type, pay_complete, issue, inspection, completed_by) FROM stdin;
  annhurst-backup.sql:940:1	2025-09-10 19:47:48.320545+00	2025-09-08	Cleophas	1	First	L07,N100000,06.09.2025,DR 
Receipt.PNG	100000	Elizabeth Mary	SAT	2025-09-06	ACCOUNT	YES	NO	YES	Cleophas
  annhurst-backup.sql:941:2	2025-09-10 21:08:11.150383+00	2025-09-08	Cleophas	4	First	L08,N65000,08.09.2025,DR 
Receipt.PNG	65000	Taiwo Tola Seun	MON	2025-09-08	ACCOUNT	YES	Bus to be Repossessed	YES	Cleophas
  annhurst-backup.sql:942:3	2025-09-12 17:11:12.749933+00	2025-07-21	Emmanuel	3	First	M01,N65000,20.07.2025,DR 
Receipt.jpg	65000	OLADAYO SUNDAY ALAO	SUN	2025-07-20	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:943:4	2025-09-12 17:14:25.893182+00	2025-07-28	Emmanuel	3	First	M01,N28000,29.07.2025,DR 
Receipt.jpeg	28000	OLADAYO SUNDAY ALAO	TUE	2025-07-29	ACCOUNT	YES	Bus Down	YES	Emmanuel
  annhurst-backup.sql:944:5	2025-09-12 17:17:31.774975+00	2025-08-04	Emmanuel	3	First	M01,N65000,03.08.2025,DR 
Receipt.pdf	65000	M1 WEEK	SUN	2025-08-03	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:945:6	2025-09-12 17:20:49.346927+00	2025-08-11	Emmanuel	3	First	M01,N65000,10.09.2025,DR 
Receipt.pdf	65000	M1 WEEK	SUN	2025-08-10	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:946:7	2025-09-12 17:24:20.437072+00	2025-08-18	Emmanuel	3	First	M01,N40000,17.08.2025,DR 
Receipt.pdf	40000	M1 WEEK	SUN	2025-08-17	ACCOUNT	NO	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:947:8	2025-09-12 17:25:42.431135+00	2025-08-18	Emmanuel	3	Second	M01,N25000,18.08.2025,DR 
Receipt.pdf	25000	M1 WEEK	MON	2025-08-18	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:948:9	2025-09-12 17:41:50.897095+00	2025-08-25	Emmanuel	3	First	M01,N65000,24.08.2025,DR 
Receipt.pdf	65000	M1 WEEK	SUN	2025-08-24	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:949:10	2025-09-12 17:44:50.821564+00	2025-09-01	Emmanuel	3	First	M01,N65000,31.08.2025,DR 
Receipt.jpeg	65000	M1 WEEK	SUN	2025-08-31	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:950:11	2025-09-12 17:47:09.09852+00	2025-09-08	Emmanuel	3	First	M01,N65000,08.09.2025,DR 
Receipt.pdf	65000	OLADAYO SUNDAY ALAO	SUN	2025-09-08	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:951:12	2025-09-29 17:25:55.761494+00	2025-09-29	Emmanuel	43	First	M04,N65000,28.09.2025,DR 
Receipt.jpeg	65000	OSUOLALE TAIWO BASIRU	SUN	2025-09-28	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:952:13	2025-09-29 18:44:44.271885+00	2025-09-22	Emmanuel	15	First	K09,N60000,22.09.2025,DR 
Receipt.pdf	60000	DAMOLA MUMEEN SHOWOBI	MON	2025-09-22	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:953:14	2025-09-29 19:17:18.184445+00	2025-09-29	Emmanuel	49	First	M10,N65000,29.09.2025,DR 
Receipt.jpg	65000	EMMANUEL IMOLE OSHATI	MON	2025-09-29	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:954:15	2025-09-29 19:26:09.226974+00	2025-09-29	Emmanuel	23	Second	K17,N20000,28.09.2025,DR 
Receipt.jpeg	20000	OLAOYE OLADEJI	SUN	2025-09-28	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:955:16	2025-11-06 16:28:20.718+00	2025-11-03	Emmanuel	21	First	K15,N50000,06.11.2025,DR 
Receipt.jpg	50000	God did	THU	2025-11-06	ACCOUNT	YES	N/A - No Issues Collecting Money	NO	Emmanuel
  annhurst-backup.sql:956:17	2025-11-06 17:15:53.628+00	2025-11-03	Emmanuel	20	First	K14,N50000,03.11.2025,DR 
Receipt.pdf	50000	USER	MON	2025-11-03	ACCOUNT	YES	N/A - No Issues Collecting Money	NO	Emmanuel
  annhurst-backup.sql:957:18	2025-11-27 09:38:48.637+00	2025-11-24	Emmanuel	3	First	M01,N65000,23.11.2025,DR 
Receipt.jpg	65000	Oladayo sunday	SUN	2025-11-23	ACCOUNT	YES	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:958:22	2025-11-27 10:48:58.803+00	2025-11-24	Emmanuel	23	First	K17,N30000,25.11.2025,DR 
Receipt.jpeg	30000	OLAOYE OLADEJI	TUE	2025-11-25	ACCOUNT	NO	N/A - No Issues Collecting Money	YES	Emmanuel
  annhurst-backup.sql:959:\.
  annhurst-backup.sql:960:
  annhurst-backup.sql:961:
  annhurst-backup.sql:962:--
  annhurst-backup.sql:963:-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:964:--
  annhurst-backup.sql:965:
  annhurst-backup.sql:966:COPY public.settings (id, created_at, phone, email, address, logo, footer_write, 
footer_head, footer_head2, services, bottom_left, bottom_right, logo_blk) FROM stdin;
  annhurst-backup.sql:967:1	2025-11-02 21:57:41.909+00	{‪+2347078571856‬}	{customerservices@annhurst-gsl.com}	13 
Association Avenue, Shangisha, Ketu\nLagos, Nigeria	settings/1759583109440-ats1.png	Your trusted partner in bus higher 
purchase solutions. We provide comprehensive financing options for transportation businesses across the globe.	Quick 
Links	Our Services	{"Bus Financing","Higher Purchase","Lease Options","Fleet Management","Insurance Solutions"}	
Annhurst Transport Service Limited. All rights reserved.	{"Privacy Policy","Terms of Service"}	
settings/1759582964099-ats.png
  annhurst-backup.sql:968:\.
  annhurst-backup.sql:969:
  annhurst-backup.sql:970:
  annhurst-backup.sql:971:--
  annhurst-backup.sql:972:-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:973:--
  annhurst-backup.sql:974:
  annhurst-backup.sql:975:COPY public.subject (id, created_at, subject) FROM stdin;
  annhurst-backup.sql:976:1	2025-11-02 21:57:41.902+00	Transaction Complaint
  annhurst-backup.sql:977:2	2025-11-02 21:57:41.903+00	Bus Down (Engine Issue)
  annhurst-backup.sql:978:3	2025-11-02 21:57:41.905+00	Bus Down (Accident)
  annhurst-backup.sql:979:4	2025-11-02 21:57:41.906+00	Bus Down (Gear Issue)
  annhurst-backup.sql:980:5	2025-11-02 21:57:41.908+00	Bus Seized (LASTMA/Police)
  annhurst-backup.sql:981:\.
  annhurst-backup.sql:982:
  annhurst-backup.sql:983:
  annhurst-backup.sql:984:--
  annhurst-backup.sql:985:-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: david
  annhurst-backup.sql:986:--
  annhurst-backup.sql:987:
  annhurst-backup.sql:988:COPY public.users (id, email, role, created_at, name, avatar) FROM stdin;
  annhurst-backup.sql:989:\.
> annhurst-backup.sql:1000:-- Name: buses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1001:--
  annhurst-backup.sql:1002:
> annhurst-backup.sql:1003:SELECT pg_catalog.setval('public.buses_id_seq', 1, false);
  annhurst-backup.sql:1004:
  annhurst-backup.sql:1005:
  annhurst-backup.sql:1006:--
  annhurst-backup.sql:1007:-- Name: co_subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1008:--
  annhurst-backup.sql:1009:
  annhurst-backup.sql:1010:SELECT pg_catalog.setval('public.co_subject_id_seq', 1, false);
  annhurst-backup.sql:1011:
  annhurst-backup.sql:1012:
  annhurst-backup.sql:1013:--
  annhurst-backup.sql:1014:-- Name: contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1015:--
  annhurst-backup.sql:1016:
  annhurst-backup.sql:1017:SELECT pg_catalog.setval('public.contact_id_seq', 29, true);
  annhurst-backup.sql:1018:
  annhurst-backup.sql:1019:
  annhurst-backup.sql:1020:--
  annhurst-backup.sql:1021:-- Name: contact_us_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1022:--
  annhurst-backup.sql:1023:
  annhurst-backup.sql:1024:SELECT pg_catalog.setval('public.contact_us_id_seq', 1, false);
  annhurst-backup.sql:1025:
  annhurst-backup.sql:1026:
  annhurst-backup.sql:1027:--
  annhurst-backup.sql:1028:-- Name: coordinators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1029:--
  annhurst-backup.sql:1030:
  annhurst-backup.sql:1031:SELECT pg_catalog.setval('public.coordinators_id_seq', 1, false);
  annhurst-backup.sql:1032:
  annhurst-backup.sql:1033:
  annhurst-backup.sql:1034:--
  annhurst-backup.sql:1035:-- Name: driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1036:--
  annhurst-backup.sql:1037:
  annhurst-backup.sql:1038:SELECT pg_catalog.setval('public.driver_id_seq', 3, true);
  annhurst-backup.sql:1039:
  annhurst-backup.sql:1040:
  annhurst-backup.sql:1041:--
> annhurst-backup.sql:1042:-- Name: inspection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1043:--
  annhurst-backup.sql:1044:
> annhurst-backup.sql:1045:SELECT pg_catalog.setval('public.inspection_id_seq', 2, true);
  annhurst-backup.sql:1046:
  annhurst-backup.sql:1047:
  annhurst-backup.sql:1048:--
  annhurst-backup.sql:1049:-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1050:--
  annhurst-backup.sql:1051:
  annhurst-backup.sql:1052:SELECT pg_catalog.setval('public.pages_id_seq', 1, false);
  annhurst-backup.sql:1053:
  annhurst-backup.sql:1054:
  annhurst-backup.sql:1055:--
  annhurst-backup.sql:1056:-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1057:--
  annhurst-backup.sql:1058:
  annhurst-backup.sql:1059:SELECT pg_catalog.setval('public.payment_id_seq', 22, true);
  annhurst-backup.sql:1060:
  annhurst-backup.sql:1061:
  annhurst-backup.sql:1062:--
  annhurst-backup.sql:1063:-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1064:--
  annhurst-backup.sql:1065:
  annhurst-backup.sql:1066:SELECT pg_catalog.setval('public.settings_id_seq', 1, false);
  annhurst-backup.sql:1067:
  annhurst-backup.sql:1068:
  annhurst-backup.sql:1069:--
  annhurst-backup.sql:1070:-- Name: subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1071:--
  annhurst-backup.sql:1072:
  annhurst-backup.sql:1073:SELECT pg_catalog.setval('public.subject_id_seq', 5, true);
  annhurst-backup.sql:1074:
  annhurst-backup.sql:1075:
  annhurst-backup.sql:1076:--
  annhurst-backup.sql:1077:-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: david
  annhurst-backup.sql:1078:--
  annhurst-backup.sql:1079:
  annhurst-backup.sql:1080:SELECT pg_catalog.setval('public.users_id_seq', 1, false);
  annhurst-backup.sql:1081:
  annhurst-backup.sql:1082:
  annhurst-backup.sql:1083:--
  annhurst-backup.sql:1084:-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1085:--
  annhurst-backup.sql:1086:
  annhurst-backup.sql:1087:ALTER TABLE ONLY public.admins
  annhurst-backup.sql:1088:    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1089:
  annhurst-backup.sql:1090:
  annhurst-backup.sql:1091:--
> annhurst-backup.sql:1092:-- Name: buses buses_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1093:--
  annhurst-backup.sql:1094:
> annhurst-backup.sql:1095:ALTER TABLE ONLY public.buses
> annhurst-backup.sql:1096:    ADD CONSTRAINT buses_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1097:
  annhurst-backup.sql:1098:
  annhurst-backup.sql:1099:--
  annhurst-backup.sql:1100:-- Name: co_subject co_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1101:--
  annhurst-backup.sql:1102:
  annhurst-backup.sql:1103:ALTER TABLE ONLY public.co_subject
  annhurst-backup.sql:1104:    ADD CONSTRAINT co_subject_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1105:
  annhurst-backup.sql:1106:
  annhurst-backup.sql:1107:--
  annhurst-backup.sql:1108:-- Name: contact contact_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1109:--
  annhurst-backup.sql:1110:
  annhurst-backup.sql:1111:ALTER TABLE ONLY public.contact
  annhurst-backup.sql:1112:    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1113:
  annhurst-backup.sql:1114:
  annhurst-backup.sql:1115:--
  annhurst-backup.sql:1116:-- Name: contact_us contact_us_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1117:--
  annhurst-backup.sql:1118:
  annhurst-backup.sql:1119:ALTER TABLE ONLY public.contact_us
  annhurst-backup.sql:1120:    ADD CONSTRAINT contact_us_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1121:
  annhurst-backup.sql:1122:
  annhurst-backup.sql:1123:--
  annhurst-backup.sql:1124:-- Name: coordinators coordinators_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1125:--
  annhurst-backup.sql:1126:
  annhurst-backup.sql:1127:ALTER TABLE ONLY public.coordinators
  annhurst-backup.sql:1128:    ADD CONSTRAINT coordinators_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1129:
  annhurst-backup.sql:1130:
  annhurst-backup.sql:1131:--
  annhurst-backup.sql:1132:-- Name: driver driver_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1133:--
  annhurst-backup.sql:1134:
  annhurst-backup.sql:1135:ALTER TABLE ONLY public.driver
  annhurst-backup.sql:1136:    ADD CONSTRAINT driver_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1137:
  annhurst-backup.sql:1138:
  annhurst-backup.sql:1139:--
> annhurst-backup.sql:1140:-- Name: inspection inspection_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1141:--
  annhurst-backup.sql:1142:
> annhurst-backup.sql:1143:ALTER TABLE ONLY public.inspection
> annhurst-backup.sql:1144:    ADD CONSTRAINT inspection_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1145:
  annhurst-backup.sql:1146:
  annhurst-backup.sql:1147:--
  annhurst-backup.sql:1148:-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1149:--
  annhurst-backup.sql:1150:
  annhurst-backup.sql:1151:ALTER TABLE ONLY public.pages
  annhurst-backup.sql:1152:    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1153:
  annhurst-backup.sql:1154:
  annhurst-backup.sql:1155:--
  annhurst-backup.sql:1156:-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1157:--
  annhurst-backup.sql:1158:
  annhurst-backup.sql:1159:ALTER TABLE ONLY public.payment
  annhurst-backup.sql:1160:    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1161:
  annhurst-backup.sql:1162:
  annhurst-backup.sql:1163:--
  annhurst-backup.sql:1164:-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1165:--
  annhurst-backup.sql:1166:
  annhurst-backup.sql:1167:ALTER TABLE ONLY public.settings
  annhurst-backup.sql:1168:    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1169:
  annhurst-backup.sql:1170:
  annhurst-backup.sql:1171:--
  annhurst-backup.sql:1172:-- Name: subject subject_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1173:--
  annhurst-backup.sql:1174:
  annhurst-backup.sql:1175:ALTER TABLE ONLY public.subject
  annhurst-backup.sql:1176:    ADD CONSTRAINT subject_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1177:
  annhurst-backup.sql:1178:
  annhurst-backup.sql:1179:--
  annhurst-backup.sql:1180:-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1181:--
  annhurst-backup.sql:1182:
  annhurst-backup.sql:1183:ALTER TABLE ONLY public.users
  annhurst-backup.sql:1184:    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
  annhurst-backup.sql:1185:
  annhurst-backup.sql:1186:
  annhurst-backup.sql:1187:--
  annhurst-backup.sql:1188:-- Name: admins_email_key; Type: INDEX; Schema: public; Owner: david
  annhurst-backup.sql:1189:--
  annhurst-backup.sql:1190:
  annhurst-backup.sql:1191:CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);
  annhurst-backup.sql:1192:
  annhurst-backup.sql:1193:
  annhurst-backup.sql:1194:--
> annhurst-backup.sql:1209:-- Name: buses buses_coordinator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1210:--
  annhurst-backup.sql:1211:
> annhurst-backup.sql:1212:ALTER TABLE ONLY public.buses
> annhurst-backup.sql:1213:    ADD CONSTRAINT buses_coordinator_fkey FOREIGN KEY (coordinator) REFERENCES 
public.coordinators(id) ON UPDATE CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1214:
  annhurst-backup.sql:1215:
  annhurst-backup.sql:1216:--
> annhurst-backup.sql:1217:-- Name: buses buses_driver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1218:--
  annhurst-backup.sql:1219:
> annhurst-backup.sql:1220:ALTER TABLE ONLY public.buses
> annhurst-backup.sql:1221:    ADD CONSTRAINT buses_driver_fkey FOREIGN KEY (driver) REFERENCES public.driver(id) ON 
UPDATE CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1222:
  annhurst-backup.sql:1223:
  annhurst-backup.sql:1224:--
  annhurst-backup.sql:1225:-- Name: contact contact_coordinator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1226:--
  annhurst-backup.sql:1227:
  annhurst-backup.sql:1228:ALTER TABLE ONLY public.contact
  annhurst-backup.sql:1229:    ADD CONSTRAINT contact_coordinator_fkey FOREIGN KEY (coordinator) REFERENCES 
public.coordinators(id) ON UPDATE CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1230:
  annhurst-backup.sql:1231:
  annhurst-backup.sql:1232:--
  annhurst-backup.sql:1233:-- Name: contact contact_driver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1234:--
  annhurst-backup.sql:1235:
  annhurst-backup.sql:1236:ALTER TABLE ONLY public.contact
  annhurst-backup.sql:1237:    ADD CONSTRAINT contact_driver_fkey FOREIGN KEY (driver) REFERENCES public.driver(id) ON 
UPDATE CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1238:
  annhurst-backup.sql:1239:
  annhurst-backup.sql:1240:--
  annhurst-backup.sql:1241:-- Name: contact contact_subject_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1242:--
  annhurst-backup.sql:1243:
  annhurst-backup.sql:1244:ALTER TABLE ONLY public.contact
  annhurst-backup.sql:1245:    ADD CONSTRAINT contact_subject_fkey FOREIGN KEY (subject) REFERENCES public.subject(id) 
ON UPDATE CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1246:
  annhurst-backup.sql:1247:
  annhurst-backup.sql:1248:--
> annhurst-backup.sql:1249:-- Name: inspection inspection_bus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1250:--
  annhurst-backup.sql:1251:
> annhurst-backup.sql:1252:ALTER TABLE ONLY public.inspection
> annhurst-backup.sql:1253:    ADD CONSTRAINT inspection_bus_fkey FOREIGN KEY (bus) REFERENCES public.buses(id) ON 
UPDATE CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1254:
  annhurst-backup.sql:1255:
  annhurst-backup.sql:1256:--
  annhurst-backup.sql:1257:-- Name: payment payment_bus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: david
  annhurst-backup.sql:1258:--
  annhurst-backup.sql:1259:
  annhurst-backup.sql:1260:ALTER TABLE ONLY public.payment
> annhurst-backup.sql:1261:    ADD CONSTRAINT payment_bus_fkey FOREIGN KEY (bus) REFERENCES public.buses(id) ON UPDATE 
CASCADE ON DELETE SET NULL;
  annhurst-backup.sql:1262:
  annhurst-backup.sql:1263:
  annhurst-backup.sql:1264:--
  annhurst-backup.sql:1265:-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
  annhurst-backup.sql:1266:--
  annhurst-backup.sql:1267:
  annhurst-backup.sql:1268:GRANT ALL ON SCHEMA public TO david;
  annhurst-backup.sql:1269:
  annhurst-backup.sql:1270:
  annhurst-backup.sql:1271:--
  annhurst-backup.sql:1272:-- PostgreSQL database dump complete
  annhurst-backup.sql:1273:--
  annhurst-backup.sql:1274:
  annhurst-backup.sql:1275:\unrestrict NQ2g9dS4cfD1ihGjO7Nv5dfjbLHcFY0A8QqpJlLv6glKNPoxi2vyivGiw9GbNIM
  annhurst-backup.sql:1276:


