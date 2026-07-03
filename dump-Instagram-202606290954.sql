--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2026-06-29 09:54:29

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
-- TOC entry 4802 (class 1262 OID 16398)
-- Name: Instagram; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Instagram" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Argentina.1252';


ALTER DATABASE "Instagram" OWNER TO postgres;

\connect "Instagram"

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
-- TOC entry 218 (class 1259 OID 16412)
-- Name: publicaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publicaciones (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    url_imagen character varying NOT NULL,
    descripcion text,
    likes integer DEFAULT 0,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.publicaciones OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: publicaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.publicaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.publicaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_usuario character varying NOT NULL,
    nombre_completo character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    foto_perfil character varying,
    biografia text
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4796 (class 0 OID 16412)
-- Dependencies: 218
-- Data for Name: publicaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4794 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4803 (class 0 OID 0)
-- Dependencies: 217
-- Name: publicaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publicaciones_id_seq', 1, false);


--
-- TOC entry 4804 (class 0 OID 0)
-- Dependencies: 215
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- TOC entry 4648 (class 2606 OID 16420)
-- Name: publicaciones publicaciones_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_pk PRIMARY KEY (id);


--
-- TOC entry 4642 (class 2606 OID 16406)
-- Name: usuarios usuarios_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pk PRIMARY KEY (id);


--
-- TOC entry 4644 (class 2606 OID 16408)
-- Name: usuarios usuarios_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_unique UNIQUE (nombre_usuario);


--
-- TOC entry 4646 (class 2606 OID 16410)
-- Name: usuarios usuarios_unique_1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_unique_1 UNIQUE (email);


--
-- TOC entry 4649 (class 2606 OID 16421)
-- Name: publicaciones publicaciones_usuarios_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_usuarios_fk FOREIGN KEY (id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-06-29 09:54:29

--
-- PostgreSQL database dump complete
--

