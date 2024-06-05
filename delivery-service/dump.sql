--
-- PostgreSQL database dump
--

-- Dumped from database version 13.8 (Debian 13.8-1.pgdg110+1)
-- Dumped by pg_dump version 13.8 (Debian 13.8-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Categories" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    "parentId" integer,
    pictures character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO "Delivery-user";

--
-- Name: Categories_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Categories_id_seq" OWNER TO "Delivery-user";

--
-- Name: Categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Categories_id_seq" OWNED BY public."Categories".id;


--
-- Name: Comments; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    title character varying(255),
    advantage character varying(255),
    flaws character varying(255),
    status integer,
    anonymously boolean DEFAULT false,
    description text,
    pictures character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "productId" integer
);


ALTER TABLE public."Comments" OWNER TO "Delivery-user";

--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Comments_id_seq" OWNER TO "Delivery-user";

--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: Food; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Food" (
    id integer NOT NULL,
    title character varying(255),
    price integer DEFAULT 0,
    count integer DEFAULT 0,
    calories integer DEFAULT 0,
    grams integer DEFAULT 0,
    in_stock integer DEFAULT 0,
    description character varying(255),
    pictures character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "categoryId" integer
);


ALTER TABLE public."Food" OWNER TO "Delivery-user";

--
-- Name: Food_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Food_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Food_id_seq" OWNER TO "Delivery-user";

--
-- Name: Food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Food_id_seq" OWNED BY public."Food".id;


--
-- Name: LikeComments; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."LikeComments" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "commentId" integer
);


ALTER TABLE public."LikeComments" OWNER TO "Delivery-user";

--
-- Name: LikeComments_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."LikeComments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."LikeComments_id_seq" OWNER TO "Delivery-user";

--
-- Name: LikeComments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."LikeComments_id_seq" OWNED BY public."LikeComments".id;


--
-- Name: OrderFoods; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."OrderFoods" (
    quantity integer,
    "orderId" integer NOT NULL,
    "foodId" integer NOT NULL
);


ALTER TABLE public."OrderFoods" OWNER TO "Delivery-user";

--
-- Name: Orders; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Orders" (
    id integer NOT NULL,
    status character varying(255),
    "deliveryAddress" character varying(255),
    "priceFood" double precision,
    "deliveryPrice" double precision,
    "isPickUp" boolean DEFAULT false,
    completed boolean DEFAULT false,
    "isPaid" boolean DEFAULT false,
    "totalPrice" double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."Orders" OWNER TO "Delivery-user";

--
-- Name: Orders_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Orders_id_seq" OWNER TO "Delivery-user";

--
-- Name: Orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Orders_id_seq" OWNED BY public."Orders".id;


--
-- Name: Purchases; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Purchases" (
    id integer NOT NULL,
    "userId" integer,
    "foodId" integer,
    "orderId" integer,
    quantity integer,
    "totalPrice" double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Purchases" OWNER TO "Delivery-user";

--
-- Name: Purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Purchases_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Purchases_id_seq" OWNER TO "Delivery-user";

--
-- Name: Purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Purchases_id_seq" OWNED BY public."Purchases".id;


--
-- Name: Ratings; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Ratings" (
    id integer NOT NULL,
    rating integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "foodId" integer
);


ALTER TABLE public."Ratings" OWNER TO "Delivery-user";

--
-- Name: Ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Ratings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Ratings_id_seq" OWNER TO "Delivery-user";

--
-- Name: Ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Ratings_id_seq" OWNED BY public."Ratings".id;


--
-- Name: ShoppingCarts; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."ShoppingCarts" (
    id integer NOT NULL,
    "userId" integer,
    "purchaseState" character varying(255),
    "productId" integer DEFAULT 0,
    "totalPrice" integer DEFAULT 0,
    count integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ShoppingCarts" OWNER TO "Delivery-user";

--
-- Name: ShoppingCarts_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."ShoppingCarts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ShoppingCarts_id_seq" OWNER TO "Delivery-user";

--
-- Name: ShoppingCarts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."ShoppingCarts_id_seq" OWNED BY public."ShoppingCarts".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: Delivery-user
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    status character varying(255),
    surname character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    phone character varying(255),
    email character varying(255),
    password character varying(255) NOT NULL,
    roles integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO "Delivery-user";

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: Delivery-user
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO "Delivery-user";

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Delivery-user
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Categories id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Categories" ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: Food id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Food" ALTER COLUMN id SET DEFAULT nextval('public."Food_id_seq"'::regclass);


--
-- Name: LikeComments id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."LikeComments" ALTER COLUMN id SET DEFAULT nextval('public."LikeComments_id_seq"'::regclass);


--
-- Name: Orders id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);


--
-- Name: Purchases id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Purchases" ALTER COLUMN id SET DEFAULT nextval('public."Purchases_id_seq"'::regclass);


--
-- Name: Ratings id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Ratings" ALTER COLUMN id SET DEFAULT nextval('public."Ratings_id_seq"'::regclass);


--
-- Name: ShoppingCarts id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."ShoppingCarts" ALTER COLUMN id SET DEFAULT nextval('public."ShoppingCarts_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Categories" (id, name, slug, "parentId", pictures, "createdAt", "updatedAt") FROM stdin;
1	Основные блюда	main-dishes	\N	\N	2024-05-27 07:51:59.587+00	2024-05-27 07:51:59.587+00
2	Салаты	salads	1	\N	2024-05-27 07:51:59.599+00	2024-05-27 07:51:59.599+00
3	Десерты	desserts	\N	\N	2024-05-27 07:51:59.606+00	2024-05-27 07:51:59.606+00
4	Холодные напитки	Cold_drinks	\N	/uploads/2024-05-27/ÑÐ¾Ð»Ð¾Ð´Ð½ÑÐµ.jpg	2024-05-27 17:16:05.91+00	2024-05-27 17:16:05.91+00
\.


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Comments" (id, title, advantage, flaws, status, anonymously, description, pictures, "createdAt", "updatedAt", "userId", "productId") FROM stdin;
5	ну так	\N	\N	\N	f	в целом норм, но  стухло	\N	2024-05-30 10:51:45.626+00	2024-05-30 10:51:45.626+00	7	5
6	ну норм	\N	\N	\N	f	не стухло, значит норм	\N	2024-05-30 10:52:32.255+00	2024-05-30 10:52:32.255+00	7	1
4	Неплохо	\N	\N	1	f	По вкусу хорошо, но что-то не хватает	\N	2024-05-27 17:39:20.175+00	2024-06-03 10:06:10.432+00	6	6
3	Качество еды	\N	\N	1	f	Всегда буду брать тут	\N	2024-05-27 14:38:01.271+00	2024-06-03 10:06:15.199+00	3	5
2	Качество еды	\N	\N	1	f	Всегда буду брать тут	\N	2024-05-27 14:30:57.786+00	2024-06-03 10:06:30.085+00	3	5
1	Вкусно и .	\N	\N	1	f	Доволен продуктом	\N	2024-05-27 08:17:22.14+00	2024-06-03 10:06:32.812+00	2	3
7	Неплохой напиток	\N	\N	1	f	Насыщенной вкус, очень хорошо заходит холодным в жаркую погоду	\N	2024-06-03 10:07:41.294+00	2024-06-03 10:08:13.506+00	2	7
8	Доволен	\N	\N	0	f	Еще раз убеждаюсь в любви к этому салату.	\N	2024-06-03 21:25:27.205+00	2024-06-03 21:25:27.205+00	2	3
\.


--
-- Data for Name: Food; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Food" (id, title, price, count, calories, grams, in_stock, description, pictures, "createdAt", "updatedAt", "categoryId") FROM stdin;
6	Цезарь с курицей	490	10	252	300	10	Лист романо, айсберг, томаты, куриная грудка, сыр пармезан, соус цезарь. Украшается яйцом всмятку и хрустящим тостом	/uploads/2024-05-27/ÑÐ°Ð»Ð°Ñ-ÑÐµÐ·Ð°ÑÑ-Ñ-ÐºÑÑÐ¸ÑÐµÐ¹.jpg	2024-05-27 14:51:09.248+00	2024-05-27 14:51:09.248+00	2
5	Спагетти Карбонара	500	15	623	230	15	<p>Итальянское блюдо с беконом, яйцом и сыром Пармезан</p>	/uploads/2024-05-27/ÑÐ¿Ð°Ð³ÐµÑÐ¸ 2.jpg	2024-05-27 07:51:59.624+00	2024-05-27 16:56:07.793+00	1
1	Пицца Маргарита	600	20	1242	656	20	<p>Традиционный рецепт пиццы с моцареллой, сочными томатами, фирменным томатным соусом и орегано (30 см)</p>	/uploads/2024-05-27/6614661970359803_3b00.jpg	2024-05-27 07:51:59.602+00	2024-05-27 17:08:15.657+00	1
7	Добрый кола	90	59	210	500	29	Газированный напиток	/uploads/2024-05-27/1415-original-1669321283.jpg	2024-05-27 17:21:29.871+00	2024-06-03 06:12:12.778+00	4
8	Кофейный крем-мусс1	150	123209	200	200	1231231	undefined	/uploads/2024-05-30/muss-kofejnyj-foto-1 (1).jpg	2024-05-30 10:17:52.926+00	2024-06-03 06:12:12.788+00	4
3	Цезарь с креветками	400	11	308	200	11	<p>Креветки, листья салата, соус «Цезарь», черри, яйца, сыр «Пармезан».</p>	/uploads/2024-05-27/ÑÐµÐ·Ð°ÑÑ Ñ ÐºÑÐµÐ²ÐµÑÐºÐ°Ð¼Ð¸.jpg	2024-05-27 07:51:59.617+00	2024-06-03 17:26:01.701+00	2
\.


--
-- Data for Name: LikeComments; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."LikeComments" (id, "createdAt", "updatedAt", "userId", "commentId") FROM stdin;
\.


--
-- Data for Name: OrderFoods; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."OrderFoods" (quantity, "orderId", "foodId") FROM stdin;
1	1	5
8	2	7
1	3	5
2	4	7
3	5	3
3	6	6
1	7	6
2	7	7
2	8	6
7	9	5
10	9	1
2	10	7
2	10	8
6	10	6
1	11	7
1	11	8
1	12	3
\.


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Orders" (id, status, "deliveryAddress", "priceFood", "deliveryPrice", "isPickUp", completed, "isPaid", "totalPrice", "createdAt", "updatedAt", "userId") FROM stdin;
1	created	г Астрахань, ул Куликова, д 54	450	79	f	f	f	529	2024-05-27 14:25:57.004+00	2024-05-27 14:25:57.004+00	3
2	created	\N	90	0	t	f	f	90	2024-05-27 17:40:47.005+00	2024-05-27 17:40:47.005+00	6
3	created	г Астрахань, ул Софьи Перовской, д 85	500	76	f	f	f	576	2024-05-28 00:21:53.168+00	2024-05-28 00:21:53.168+00	2
4	created	г Астрахань, ул Циолковского, д 26	180	76	f	f	f	256	2024-05-28 00:23:02.253+00	2024-05-28 00:23:02.253+00	2
5	created	г Астрахань, ул Красная Набережная, зд 167	1200	88	f	f	f	1288	2024-05-28 00:23:25.585+00	2024-05-28 00:23:25.585+00	2
6	created	г Астрахань, ул Ахтубинская, д 29	1470	76	f	f	f	1546	2024-05-28 10:59:35.816+00	2024-05-28 10:59:35.816+00	2
7	created	г Астрахань, ул Татищева, д 61Б	670	43	f	f	f	713	2024-05-28 11:15:18.793+00	2024-05-28 11:15:18.793+00	2
9	received	\N	9500	0	t	t	f	9500	2024-05-30 10:47:58.993+00	2024-05-30 10:51:14.713+00	7
8	delivery	г Астрахань, ул Кольцевая, д 1/7	980	54	f	f	f	1034	2024-05-30 10:04:53.576+00	2024-05-30 11:27:25.53+00	2
10	received	г Астрахань, тер. СНТ Садовод-5, пер 1-й Астраханские сады, д 7	3420	97	f	t	f	3517	2024-05-30 12:20:13.261+00	2024-05-30 12:23:51.786+00	8
11	received	г Астрахань, ул Савушкина, д 25А	12433	44	f	t	f	12477	2024-06-03 06:12:12.763+00	2024-06-03 06:13:02.912+00	2
12	received	г Астрахань, ул Всеволода Ноздрина, д 67	400	62	f	t	f	462	2024-06-03 17:26:01.692+00	2024-06-03 17:26:15.078+00	2
\.


--
-- Data for Name: Purchases; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Purchases" (id, "userId", "foodId", "orderId", quantity, "totalPrice", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Ratings; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Ratings" (id, rating, "createdAt", "updatedAt", "userId", "foodId") FROM stdin;
2	5	2024-05-27 14:30:57.797+00	2024-05-27 14:30:57.797+00	3	5
1	5	2024-05-27 08:17:22.161+00	2024-05-27 08:17:22.161+00	2	\N
4	4	2024-05-27 17:39:20.177+00	2024-05-27 17:39:20.177+00	6	6
5	2	2024-05-30 10:51:45.627+00	2024-05-30 10:51:45.627+00	7	5
6	5	2024-05-30 10:52:32.261+00	2024-05-30 10:52:32.261+00	7	1
7	5	2024-06-03 10:07:41.303+00	2024-06-03 10:07:41.303+00	2	7
8	5	2024-06-03 21:25:27.197+00	2024-06-03 21:25:27.197+00	2	3
\.


--
-- Data for Name: ShoppingCarts; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."ShoppingCarts" (id, "userId", "purchaseState", "productId", "totalPrice", count, "createdAt", "updatedAt") FROM stdin;
46	6		7	630	7	2024-05-27 18:34:06.349+00	2024-05-27 18:35:02.894+00
18	6		6	490	17	2024-05-27 17:44:46.065+00	2024-05-27 17:45:22.019+00
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: Delivery-user
--

COPY public."Users" (id, name, status, surname, username, phone, email, password, roles, "createdAt", "updatedAt") FROM stdin;
1	Дамир	status	Дамбинов	damur	\N	damur2004@gmail.com	$2a$10$G95IAnj3TZFrU6YFJNbLbe3ZdoPsSXDoMXApb61.R1DMS57FOOqby	2	2024-05-27 08:00:54.168+00	2024-05-27 08:00:54.168+00
4	Валя	new	Валентинов	value	\N	vtelkunov@mail.ru	$2a$10$hlfC.hQrzBehAWCRR5Y16u4991XN3M/u/oi3oADFrvHVryRdeyjNq	1	2024-05-27 14:26:12.469+00	2024-05-27 14:45:50.546+00
3	Руфат	new	Ахметов	Elastars	\N	rufata56@gmail.com	$2a$10$eJJYeNSVJy8ItEYE5AfJ9eobHhyeIcQBePZTSUHFcK3t/yZFr7Gxi	1	2024-05-27 14:22:18.913+00	2024-05-27 14:45:59.14+00
5	Александра	status	Домашенко	DomiTi	\N	loss.m@inbox.ru	$2a$10$oFJMN6O/PGEmr2s68cDJB.XTqorCZPpwUxBdeIG8M618cOqfkpAku	1	2024-05-27 15:17:33.831+00	2024-05-27 15:17:33.831+00
6	Евгений	status	Борзов	tortar02	\N	tortar02@mail.ru	$2a$10$hpW7u1wenVV4T7YB25P6QuQ.jNtgeZlTh7saznURp9Kd3Ebv0CqW.	2	2024-05-27 17:29:13.85+00	2024-05-27 18:32:31.199+00
2	Дамир	new	Дамбингов	damur	\N	damur@gmail.com	$2a$10$7VbsEEMF50JtBrOEP10t4u8S1sm/Fn9tOrjpCBUdogtQOZvJ3jsza	1	2024-05-27 08:02:50.136+00	2024-05-28 00:24:42.822+00
7	Валентина	status	Шейкх	valentina.borm04@mail.ru	\N	valentina.borm04@mail.ru	$2a$10$b7wSUIkPd.XcUKZWkOoKG.QvVEhKhR.w2Szc/hUH8wAW0XfxNa9uK	2	2024-05-30 10:45:34.691+00	2024-05-30 10:45:34.691+00
8	Дамирв	status	Дамирв	damuК	\N	damur1337@gmail.com	$2a$10$/2Py6mNVYLS8budTn347TeWcF97uTsa2gQLDzISEJGylZSFGTNaZe	2	2024-05-30 12:17:37.957+00	2024-05-30 12:17:37.957+00
\.


--
-- Name: Categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Categories_id_seq"', 4, true);


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 8, true);


--
-- Name: Food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Food_id_seq"', 8, true);


--
-- Name: LikeComments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."LikeComments_id_seq"', 1, false);


--
-- Name: Orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Orders_id_seq"', 12, true);


--
-- Name: Purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Purchases_id_seq"', 1, false);


--
-- Name: Ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Ratings_id_seq"', 8, true);


--
-- Name: ShoppingCarts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."ShoppingCarts_id_seq"', 68, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Delivery-user
--

SELECT pg_catalog.setval('public."Users_id_seq"', 8, true);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: Food Food_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_pkey" PRIMARY KEY (id);


--
-- Name: LikeComments LikeComments_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."LikeComments"
    ADD CONSTRAINT "LikeComments_pkey" PRIMARY KEY (id);


--
-- Name: OrderFoods OrderFoods_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."OrderFoods"
    ADD CONSTRAINT "OrderFoods_pkey" PRIMARY KEY ("orderId", "foodId");


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: Purchases Purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Purchases"
    ADD CONSTRAINT "Purchases_pkey" PRIMARY KEY (id);


--
-- Name: Ratings Ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY (id);


--
-- Name: ShoppingCarts ShoppingCarts_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."ShoppingCarts"
    ADD CONSTRAINT "ShoppingCarts_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: ratings_user_id_food_id; Type: INDEX; Schema: public; Owner: Delivery-user
--

CREATE UNIQUE INDEX ratings_user_id_food_id ON public."Ratings" USING btree ("userId", "foodId");


--
-- Name: shopping_carts_user_id_product_id; Type: INDEX; Schema: public; Owner: Delivery-user
--

CREATE UNIQUE INDEX shopping_carts_user_id_product_id ON public."ShoppingCarts" USING btree ("userId", "productId");


--
-- Name: Categories Categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comments Comments_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comments Comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Food Food_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LikeComments LikeComments_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."LikeComments"
    ADD CONSTRAINT "LikeComments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comments"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LikeComments LikeComments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."LikeComments"
    ADD CONSTRAINT "LikeComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderFoods OrderFoods_foodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."OrderFoods"
    ADD CONSTRAINT "OrderFoods_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderFoods OrderFoods_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."OrderFoods"
    ADD CONSTRAINT "OrderFoods_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Orders Orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Purchases Purchases_foodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Purchases"
    ADD CONSTRAINT "Purchases_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE;


--
-- Name: Purchases Purchases_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Purchases"
    ADD CONSTRAINT "Purchases_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE;


--
-- Name: Purchases Purchases_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Purchases"
    ADD CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ratings Ratings_foodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Ratings Ratings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ShoppingCarts ShoppingCarts_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."ShoppingCarts"
    ADD CONSTRAINT "ShoppingCarts_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ShoppingCarts ShoppingCarts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Delivery-user
--

ALTER TABLE ONLY public."ShoppingCarts"
    ADD CONSTRAINT "ShoppingCarts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

