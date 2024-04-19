--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.4

-- Started on 2024-01-28 12:05:41

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

--
-- TOC entry 5 (class 2615 OID 16385)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--
DROP SCHEMA public;
CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 873 (class 1247 OID 49432)
-- Name: enum_ingredient_cocktails_unit; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_ingredient_cocktails_unit AS ENUM (
    'g',
    'ml'
);


ALTER TYPE public.enum_ingredient_cocktails_unit OWNER TO postgres;


--
-- TOC entry 839 (class 1247 OID 16387)
-- Name: enum_users_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_status AS ENUM (
    'pending',
    'active',
    'blocked'
);


ALTER TYPE public.enum_users_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16393)
-- Name: cocktails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cocktails (
    id integer NOT NULL,
    name jsonb NOT NULL,
    description jsonb NOT NULL,
    recipe jsonb NOT NULL,
    img character varying(255),
    strength character varying(255) NOT NULL,
    taste character varying(255) NOT NULL,
    base character varying(255) NOT NULL,
    color character varying(255) NOT NULL,
    method character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.cocktails OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16398)
-- Name: cocktails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cocktails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cocktails_id_seq OWNER TO postgres;

--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 210
-- Name: cocktails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cocktails_id_seq OWNED BY public.cocktails.id;


--
-- TOC entry 211 (class 1259 OID 16399)
-- Name: ingredient_cocktails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient_cocktails (
    id integer NOT NULL,
    "cocktailId" integer,
    "ingredientId" integer,
    amount integer,
    required boolean DEFAULT true NOT NULL,
    unit public.enum_ingredient_cocktails_unit DEFAULT 'ml'::public.enum_ingredient_cocktails_unit NOT NULL

);


ALTER TABLE public.ingredient_cocktails OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16402)
-- Name: ingredient_cocktails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredient_cocktails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredient_cocktails_id_seq OWNER TO postgres;

--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 212
-- Name: ingredient_cocktails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredient_cocktails_id_seq OWNED BY public.ingredient_cocktails.id;


--
-- TOC entry 213 (class 1259 OID 16403)
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    id integer NOT NULL,
    name jsonb NOT NULL,
    description jsonb,
    img character varying(255),
    strength character varying(255) NOT NULL,
    base character varying(255) NOT NULL,
    taste character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16408)
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_id_seq OWNER TO postgres;

--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 214
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- TOC entry 215 (class 1259 OID 16409)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    value character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16414)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 216
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 217 (class 1259 OID 16415)
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    "expireAt" timestamp with time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.token OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16418)
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.token_id_seq OWNER TO postgres;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 218
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;


--
-- TOC entry 219 (class 1259 OID 16419)
-- Name: user_cocktails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_cocktails (
    id integer NOT NULL,
    "cocktailId" integer,
    "userId" integer
);


ALTER TABLE public.user_cocktails OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16422)
-- Name: user_cocktails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_cocktails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_cocktails_id_seq OWNER TO postgres;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 220
-- Name: user_cocktails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_cocktails_id_seq OWNED BY public.user_cocktails.id;


--
-- TOC entry 221 (class 1259 OID 16423)
-- Name: user_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_ingredients (
    id integer NOT NULL,
    "ingredientId" integer,
    "userId" integer
);


ALTER TABLE public.user_ingredients OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16426)
-- Name: user_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_ingredients_id_seq OWNER TO postgres;

--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 222
-- Name: user_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_ingredients_id_seq OWNED BY public.user_ingredients.id;


--
-- TOC entry 223 (class 1259 OID 16427)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    "userId" integer,
    "roleId" integer
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16430)
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO postgres;

--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- TOC entry 225 (class 1259 OID 16431)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    status public.enum_users_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16436)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3222 (class 2604 OID 16437)
-- Name: cocktails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cocktails ALTER COLUMN id SET DEFAULT nextval('public.cocktails_id_seq'::regclass);


--
-- TOC entry 3223 (class 2604 OID 16438)
-- Name: ingredient_cocktails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_cocktails ALTER COLUMN id SET DEFAULT nextval('public.ingredient_cocktails_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 16439)
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 16440)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3226 (class 2604 OID 16441)
-- Name: token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);


--
-- TOC entry 3227 (class 2604 OID 16442)
-- Name: user_cocktails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cocktails ALTER COLUMN id SET DEFAULT nextval('public.user_cocktails_id_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 16443)
-- Name: user_ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ingredients ALTER COLUMN id SET DEFAULT nextval('public.user_ingredients_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 16444)
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 16445)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3414 (class 0 OID 16393)
-- Dependencies: 209
-- Data for Name: cocktails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cocktails (id, name, description, recipe, img, strength, taste, base, color, method, "createdAt", "updatedAt") FROM stdin;
1	{"en": "test1", "uk": "тест1"}	{"en": "Famous cockta", "uk": "Відомий коктей"}	{"en": {"1": "Fill collins with ice cubes to the top", "2": "Pour 50 ml of vodka"}, "uk": {"1": "Наповни колінз кубиками льоду догори", "2": "Налий горілку 50 мл"}}	http://sdfasdf.com	Alcohol	sweet	Vodka	Orange	Mix build	2024-01-27 17:03:23.433+00	2024-01-27 17:03:23.433+00
2	{"en": "test2", "uk": "тест2"}	{"en": "Famous cockta", "uk": "Відомий коктей"}	{"en": {"1": "Fill collins with ice cubes to the top", "2": "Pour 50 ml of vodka"}, "uk": {"1": "Наповни колінз кубиками льоду догори", "2": "Налий горілку 50 мл"}}	http://sdfasdf.com	Alcohol	sweet	Vodka	Orange	Mix build	2024-01-27 17:03:23.433+00	2024-01-27 17:03:23.433+00
\.


--
-- TOC entry 3416 (class 0 OID 16399)
-- Dependencies: 211
-- Data for Name: ingredient_cocktails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredient_cocktails (id, "cocktailId", "ingredientId", amount, required) FROM stdin;
7	1	1	50	true
\.


--
-- TOC entry 3418 (class 0 OID 16403)
-- Dependencies: 213
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (id, name, description, img, strength, base, taste, "createdAt", "updatedAt") FROM stdin;
1	{"en": "Whisky43", "uk": "Віскі"}	{"en": "Classik alko", "uk": "Класичний алкоголь"}	https://iasd3efk.images.com	alcohol	grain	sweet	2024-01-27 17:03:29.938+00	2024-01-27 17:03:29.938+00
2	{"en": "test2", "uk": "тест2"}	{"en": "Classik alko", "uk": "Класичний алкоголь"}	https://iasd3efk.images.com	alcohol	grain	sweet	2024-01-27 17:03:29.938+00	2024-01-27 17:03:29.938+00
\.


--
-- TOC entry 3420 (class 0 OID 16409)
-- Dependencies: 215
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, value, description, "createdAt", "updatedAt") FROM stdin;
1	user	user	2024-01-27 17:03:23.269+00	2024-01-27 17:03:23.269+00
2	admin	admin	2024-01-27 17:03:23.269+00	2024-01-27 17:03:23.269+00
\.


--
-- TOC entry 3422 (class 0 OID 16415)
-- Dependencies: 217
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token (id, token, "expireAt", "userId") FROM stdin;
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RkQHRlc3QuY29tIiwic3ViIjo0LCJpYXQiOjE3MDY0MzExNjYsImV4cCI6MTcwNjUxNzU2Nn0.kAw3LmMyGMzx--PNcHJpSUXN87wVpboea0q1RCP-22c	2024-01-29 08:39:26.292+00	4
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QtYWN0aXZlQHRlc3QuY29tIiwic3ViIjo1LCJpYXQiOjE3MDY0MzM1NjAsImV4cCI6MTcwNjUxOTk2MH0.Dym1IvddzW1DfR0chbPGWZSH8DLD4i8SyDcnsD9mA4M	2024-01-29 09:19:20.699+00	5
\.


--
-- TOC entry 3424 (class 0 OID 16419)
-- Dependencies: 219
-- Data for Name: user_cocktails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_cocktails (id, "cocktailId", "userId") FROM stdin;
\.


--
-- TOC entry 3426 (class 0 OID 16423)
-- Dependencies: 221
-- Data for Name: user_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_ingredients (id, "ingredientId", "userId") FROM stdin;
\.


--
-- TOC entry 3428 (class 0 OID 16427)
-- Dependencies: 223
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, "userId", "roleId") FROM stdin;
1	1	2
4	5	1
\.


--
-- TOC entry 3430 (class 0 OID 16431)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, status, "createdAt", "updatedAt") FROM stdin;
1	admin@test.com	$2a$05$KGXvWFFtCcPUdZQl.ge2WuWNv3PdFP5ptJUqXy44RI/LhNkBJ5tju	active	2024-01-27 17:03:23.286+00	2024-01-27 17:03:23.286+00
5	test-active@test.com	$2a$05$4uCu/0fGTsu402kuEPu1QuHDP/UtWYU7DefhI7GwBHJKMz9NLV1LG	active	2024-01-28 09:19:20.623+00	2024-01-28 09:19:20.623+00
\.


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 210
-- Name: cocktails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cocktails_id_seq', 13, true);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 212
-- Name: ingredient_cocktails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredient_cocktails_id_seq', 7, true);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 214
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 6, true);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 216
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 218
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.token_id_seq', 5, true);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 220
-- Name: user_cocktails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_cocktails_id_seq', 1, false);


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 222
-- Name: user_ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_ingredients_id_seq', 1, false);


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 4, true);


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 3232 (class 2606 OID 16447)
-- Name: cocktails cocktails_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cocktails
    ADD CONSTRAINT cocktails_name_key UNIQUE (name);


--
-- TOC entry 3234 (class 2606 OID 16449)
-- Name: cocktails cocktails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cocktails
    ADD CONSTRAINT cocktails_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 16451)
-- Name: ingredient_cocktails ingredient_cocktails_cocktailId_ingredientId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_cocktails
    ADD CONSTRAINT "ingredient_cocktails_cocktailId_ingredientId_key" UNIQUE ("cocktailId", "ingredientId");


--
-- TOC entry 3238 (class 2606 OID 16453)
-- Name: ingredient_cocktails ingredient_cocktails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_cocktails
    ADD CONSTRAINT ingredient_cocktails_pkey PRIMARY KEY (id);


--
-- TOC entry 3240 (class 2606 OID 16455)
-- Name: ingredients ingredients_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_name_key UNIQUE (name);


--
-- TOC entry 3242 (class 2606 OID 16457)
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 16459)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 16461)
-- Name: roles roles_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_value_key UNIQUE (value);


--
-- TOC entry 3248 (class 2606 OID 16463)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16465)
-- Name: token token_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key UNIQUE (token);


--
-- TOC entry 3252 (class 2606 OID 16467)
-- Name: user_cocktails user_cocktails_cocktailId_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cocktails
    ADD CONSTRAINT "user_cocktails_cocktailId_userId_key" UNIQUE ("cocktailId", "userId");


--
-- TOC entry 3254 (class 2606 OID 16469)
-- Name: user_cocktails user_cocktails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cocktails
    ADD CONSTRAINT user_cocktails_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 16471)
-- Name: user_ingredients user_ingredients_ingredientId_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ingredients
    ADD CONSTRAINT "user_ingredients_ingredientId_userId_key" UNIQUE ("ingredientId", "userId");


--
-- TOC entry 3258 (class 2606 OID 16473)
-- Name: user_ingredients user_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ingredients
    ADD CONSTRAINT user_ingredients_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 16475)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 16477)
-- Name: user_roles user_roles_userId_roleId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_roleId_key" UNIQUE ("userId", "roleId");


--
-- TOC entry 3264 (class 2606 OID 16479)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3266 (class 2606 OID 16481)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3267 (class 2606 OID 16482)
-- Name: ingredient_cocktails ingredient_cocktails_cocktailId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_cocktails
    ADD CONSTRAINT "ingredient_cocktails_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES public.cocktails(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3268 (class 2606 OID 16487)
-- Name: ingredient_cocktails ingredient_cocktails_ingredientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient_cocktails
    ADD CONSTRAINT "ingredient_cocktails_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES public.ingredients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3269 (class 2606 OID 16492)
-- Name: user_cocktails user_cocktails_cocktailId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cocktails
    ADD CONSTRAINT "user_cocktails_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES public.cocktails(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3270 (class 2606 OID 16497)
-- Name: user_cocktails user_cocktails_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_cocktails
    ADD CONSTRAINT "user_cocktails_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3271 (class 2606 OID 16502)
-- Name: user_ingredients user_ingredients_ingredientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ingredients
    ADD CONSTRAINT "user_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES public.ingredients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3272 (class 2606 OID 16507)
-- Name: user_ingredients user_ingredients_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ingredients
    ADD CONSTRAINT "user_ingredients_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3273 (class 2606 OID 16512)
-- Name: user_roles user_roles_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3274 (class 2606 OID 16517)
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-01-28 12:05:41

--
-- PostgreSQL database dump complete
--

