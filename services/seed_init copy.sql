--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3 (Ubuntu 12.3-1.pgdg16.04+1)
-- Dumped by pg_dump version 12.3

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
-- Data for Name: accounts; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.accounts VALUES ('e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', 'admin@medigaplife.com', 'MedigapLife', true, '2020-08-26 19:28:43.315359+00', '2020-08-26 19:28:43.315359+00');


--
-- Data for Name: affiliates; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.affiliates VALUES ('1c417ae0-ae30-40cd-8f51-e83201abca87', '', false, false, NULL, false, false, 'CoverageOne  Insurance', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('99126f5e-e30a-4d41-8a9e-9871aef4bd89', 'TVHOUS12', true, false, NULL, false, false, 'TV-Houston-Story', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('fed5e1b6-9a0c-4cba-badf-a85935cdacf6', 'TVPHXS12', true, false, NULL, false, false, 'TV-Phoenix-SAT', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('14d344b9-93de-43e1-8264-94742e379f88', NULL, false, false, '{8eb937ce-d9de-4911-813b-46af4a5fe4f2}', true, false, 'You', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('5a4b7fce-4b46-421d-b97c-55aed10a07f5', 'GCBS1101', true, false, NULL, false, false, 'GEO', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('f0d59025-6f95-467d-b6d6-23fd03ff9d74', 'A151101', false, false, NULL, false, false, 'Direct Health', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('e58ebe07-139a-473f-8777-0c751ea9a3ef', 'RO1101', true, false, NULL, false, false, 'ROBERT', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('af1351fd-8374-4384-afe5-574677577973', 'DRIPSIN', false, false, NULL, false, false, 'DRIPS Inbound', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('33618f0d-2b24-4b02-9f83-1ca9e545f1c2', 'F11-1', false, false, NULL, false, false, 'FILIPINOS', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('8359b084-aa49-4b84-b257-2d5e86fcae59', '', true, true, NULL, false, false, 'TF-800-PUBLISHER', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('57624334-8d6c-4609-813a-65acef33dcc6', 'MAAI1101', true, false, NULL, false, false, 'MedAdvAI', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('a01bc382-0505-4312-b481-374be22346b8', 'Indiana 04/2020', true, false, NULL, false, false, 'Medigap Mailers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');
INSERT INTO contactcenter.affiliates VALUES ('0cf5c6ef-4a62-4c99-8e20-77145e65e50c', 'TVPHXC11', true, false, NULL, false, false, 'TV-Phoenix-Cable', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.323591+00', '2020-08-26 19:28:43.323591+00');


--
-- Data for Name: app_configuration; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.app_configuration VALUES (1, 'twilio', '{"voice": {"recording": true}, "callerId": "+17863042400", "workflowSid": "WW4b6dde9227a729c4f7302e2461241f66", "applicationSid": "AP7e53f233f0b1afe2f1b83cb999d1469b", "facebookPageId": null, "workerBusyActivitySid": "WA54b9f449d2ce1a711088c7b8f06c55c9", "workerIdleActivitySid": "WAb80b844c36de5fb9c28d2b260d1d06d9", "workerOfflineActivitySid": "WAc38346fcde5ea347d0afc6a268ea08bf", "workerReservedActivitySid": "WA6d28e15e582daaf24f0f529247cd9f51", "workerAvailableActivitySid": "WAfc27609691bfd97cb598f80abda2474c", "workerUnavailableActivitySid": "WA7120594c4a2973cddf80e6bc90bc59ab"}', '2020-08-26 19:28:43.337111+00', '2020-08-26 19:28:43.337111+00');
INSERT INTO contactcenter.app_configuration VALUES (2, 'queues', '[{"id": "chat", "expression": "channel == \"chat\"", "friendlyName": "Chat Queue", "taskQueueSid": "WQce55e26c7ef17b8e6b279f6a76c0605c", "filterFriendlyName": "Chat", "targetWorkerExpression": ""}, {"id": "phone", "expression": "channel == \"phone\"", "friendlyName": "Phone Queue", "taskQueueSid": "WQf41143719da2c50d59a5ec3e305ff7c0", "filterFriendlyName": "Phone", "targetWorkerExpression": "task.team == worker.team OR task.transferToWorkerSid = worker.sid"}, {"id": "video", "expression": "channel == \"video\"", "friendlyName": "Video Queue", "taskQueueSid": "WQ8526281ebb04398d148557e52a1b7f3d", "filterFriendlyName": "Video", "targetWorkerExpression": ""}, {"id": "callback", "expression": "channel == \"callback\"", "friendlyName": "Callback Queue", "taskQueueSid": "WQf95d4593f1da2d0d8de70dc0c5faac9b", "filterFriendlyName": "Callback", "targetWorkerExpression": ""}]', '2020-08-26 19:28:43.337111+00', '2020-08-26 19:28:43.337111+00');
INSERT INTO contactcenter.app_configuration VALUES (3, 'ivr', '{"text": "Thanks for calling. You can press a key or say the department name. Press 1 for Sales, press 2 for Support", "options": [{"id": "sales", "digit": 1, "friendlyName": "Sales"}, {"id": "support", "digit": 2, "friendlyName": "Support"}]}', '2020-08-26 19:28:43.337111+00', '2020-08-26 19:28:43.337111+00');


--
-- Data for Name: buyers; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.buyers VALUES ('bf2f99b5-994c-4c33-9f41-f5a66bde7176', '', false, true, false, 'B1101', 'NXT', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('a6787b9e-d82c-4e6c-8b6c-e8fe07f0cae0', '', false, false, false, NULL, 'Synergy', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('a843d0f5-0708-4d2e-8b83-739376b4ca6f', '', false, false, true, 'A121101', 'Insurd.net', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('a38f0f4d-cd7e-4426-8207-50aeb57a0f8e', '', false, false, true, NULL, 'MedigapLifeDR', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('521002f2-c96a-41f1-9c00-576977ce9ec7', '', false, false, true, 'A110121', 'Medigap', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('8fb5e3f1-675b-4c7d-abcf-d264e8f68d7f', '', false, false, true, 'A181101', 'GO Health U65', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('e5f59ed1-e704-471d-8890-1d659d4b7c95', '', false, false, false, 'AP1101', 'AppleInsurance', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('b7d86c87-6c9b-4f65-8a70-76ecb5c3f83c', '', true, false, false, 'U65PLAT12', 'PlatinumHealth', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('dd834fd4-9af1-444d-8388-97e29c434164', '', false, false, false, NULL, 'MGL Mailer', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('28b07b98-baa8-4af6-919a-3cabb6c1412a', '', false, false, false, 'A1101', 'PolicyBind', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('01a92a9f-8e24-4d9d-8b24-b15b16faedc2', '', false, false, true, 'A171101', 'GO Health', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('11e773a5-9a22-48ac-8d45-ac4131983baf', '', true, false, false, 'AP1102', 'CoverageOne-MAPD', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('a4a6fad4-7c41-4932-9261-b8e6acfdb71c', '', true, false, false, 'A131101', 'Healthworks', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('8cebe0e8-054f-447b-a999-857e679bf674', '', true, false, false, NULL, 'NHP', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');
INSERT INTO contactcenter.buyers VALUES ('e8fe77e0-5042-43bf-a8b5-e51541f46203', '', false, false, false, 'Spring', 'Spring', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:28:43.342208+00', '2020-08-26 19:28:43.342208+00');


--
-- Data for Name: call_instructions; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.call_instructions VALUES (1, 15, 'number', '+12013593476', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (2, 10, 'number', '+18553707864', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (3, 20, 'number', '+18779144145', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (4, 10, 'number', '+12013593479', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (5, 15, 'number', '+17542032862', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (6, 30, 'number', '+12012540135', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (7, 15, 'number', '+18888950228', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (8, 16, 'number', '+17542532187', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (9, 3, 'number', '+18669811443', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (10, 10, 'number', '+18555491430', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (11, 0, 'number', '+18559266324', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (12, 10, 'number', '+12392999197', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (13, 30, 'number', '+19546031097', NULL, '2020-08-26 19:30:31.545895+00', '2020-08-26 19:30:31.545895+00');
INSERT INTO contactcenter.call_instructions VALUES (14, 15, 'number', '+18625761202', NULL, '2020-08-26 19:32:42.717153+00', '2020-08-26 19:32:42.717153+00');


--
-- Data for Name: routing_priorities; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.routing_priorities VALUES (1, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (2, 2, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (3, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (4, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (5, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (6, 4, 4, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (7, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (8, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (9, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (10, 2, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (11, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (12, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (13, 1, 2, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (14, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (15, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (16, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (17, 2, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (18, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (19, 1, 2, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (20, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (21, 4, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (22, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (23, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (24, 2, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (25, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (26, 2, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (27, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (28, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (29, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (30, 3, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (31, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (32, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (33, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (34, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (35, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (36, 2, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (37, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (38, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (39, 1, 1, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');
INSERT INTO contactcenter.routing_priorities VALUES (40, 1, 2, '2020-08-26 19:31:44.474329+00', '2020-08-26 19:31:44.474329+00');


--
-- Data for Name: schedules_and_capacities; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.schedules_and_capacities VALUES (1, 3, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (2, -1, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (3, -1, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, 250, 10, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (4, 20, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (5, 10, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (6, -1, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (7, 6, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, 110, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (8, 3, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (9, -1, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (10, -1, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, 15, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (11, -1, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (12, 15, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (13, 10, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:30:31.559482+00', '2020-08-26 19:30:31.559482+00');
INSERT INTO contactcenter.schedules_and_capacities VALUES (14, 3, 'Eastern Standard Time', -1.00, -1.00, -1.00, -1.00, -1, -1, -1, -1, '2020-08-26 19:32:42.718025+00', '2020-08-26 19:32:42.718025+00');


--
-- Data for Name: targets; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.targets VALUES (1, 'TAa2502cb397f64b06b92da83f4dc5e287', 1, false, 'MGLFB-Ad-LiveCalls', 'onConvert', '521002f2-c96a-41f1-9c00-576977ce9ec7', 0, 1, 'Mgl Fb Live Transfers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (2, NULL, 2, false, 'A111102', 'onConvert', '01a92a9f-8e24-4d9d-8b24-b15b16faedc2', 0, 2, 'GoHealth Premium Line', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (3, '', 3, false, 'A111101', 'onConvert', '01a92a9f-8e24-4d9d-8b24-b15b16faedc2', 0, 3, 'GoHealth', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (4, NULL, 4, false, 'Indiana 04/2020', 'onConvert', '521002f2-c96a-41f1-9c00-576977ce9ec7', 0, 4, 'MGL Mailer', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (5, NULL, 5, false, 'D120001', 'onConvert', '11e773a5-9a22-48ac-8d45-ac4131983baf', 0, 5, 'CoverageOne-MAPD', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (6, NULL, 6, false, 'MHAMAIL', 'onConvert', NULL, 0, 6, 'MHA Mailers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', false, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (7, NULL, 7, false, 'A31001', 'onConvert', 'a4a6fad4-7c41-4932-9261-b8e6acfdb71c', 0, 7, 'Healthworks', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (8, NULL, 8, false, 'D120002', 'onConvert', '11e773a5-9a22-48ac-8d45-ac4131983baf', 0, 8, 'CoverageOne-Mailer', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (9, 'TAa2502cb397f64b06b92da83f4dc5e287', 9, false, 'ANS101', 'onConvert', NULL, 0, 9, 'AnswerForce', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (10, NULL, 10, false, 'SVG', 'onConvert', 'e8fe77e0-5042-43bf-a8b5-e51541f46203', 0, 10, 'Spring', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (11, NULL, 11, false, 'A111103', 'onConvert', '01a92a9f-8e24-4d9d-8b24-b15b16faedc2', 0, 11, 'GoHealth Mail Line', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (12, '', 12, false, 'A131101', 'onConvert', 'a38f0f4d-cd7e-4426-8207-50aeb57a0f8e', 0, 12, 'MedigapLife', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (13, '', 13, false, 'A131101', 'onConvert', 'a38f0f4d-cd7e-4426-8207-50aeb57a0f8e', 0, 13, 'MedigapLife - 800IVR', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', false, '2020-08-26 19:30:31.589414+00', '2020-08-26 19:30:31.589414+00');
INSERT INTO contactcenter.targets VALUES (14, 'TAa2502cb397f64b06b92da83f4dc5e287', 14, false, 'MGL-Dev', 'onConvert', '521002f2-c96a-41f1-9c00-576977ce9ec7', 0, 14, 'Mgl Developers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:32:42.729102+00', '2020-08-26 19:32:42.729102+00');


--
-- Data for Name: call_routes; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.call_routes VALUES (1, 1, 4, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (2, 2, 9, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (3, 3, 5, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (4, 4, 7, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (5, 5, 3, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (6, 6, 12, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (7, 7, 12, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (8, 8, 13, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (9, 9, 3, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (10, 10, 12, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (11, 11, 5, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (12, 12, 7, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (13, 13, 2, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (14, 14, NULL, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (15, 15, 5, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (16, 16, 3, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (17, 17, 1, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (18, 18, 10, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (19, 19, 2, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (20, 20, 7, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (21, 21, 9, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (22, 22, 8, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (23, 23, 11, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (24, 24, 9, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (25, 25, 5, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (26, 26, 1, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (27, 27, 3, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (28, 28, 7, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (29, 29, 10, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (30, 30, 9, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (31, 31, 6, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (32, 32, 5, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (33, 33, 7, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (34, 34, 3, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (35, 35, 10, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (36, 36, 12, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (37, 37, 8, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (38, 38, 10, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (39, 39, 3, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');
INSERT INTO contactcenter.call_routes VALUES (40, 40, 2, NULL, NULL, NULL, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.583877+00', '2020-08-26 19:31:44.583877+00');


--
-- Data for Name: duplicate_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.duplicate_settings VALUES (1, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (2, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (3, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (4, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (5, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (6, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (7, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (8, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (9, -1, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (10, -1, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (11, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (12, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (13, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (14, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (15, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (16, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (17, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (18, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (19, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (20, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (21, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (22, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (23, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (24, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (25, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (26, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (27, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (28, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (29, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (30, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (31, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (32, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (33, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (34, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (35, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (36, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (37, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (38, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (39, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');
INSERT INTO contactcenter.duplicate_settings VALUES (40, 0, '2020-08-26 19:31:44.489879+00', '2020-08-26 19:31:44.489879+00');


--
-- Data for Name: call_conversion_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.call_conversion_settings VALUES (1, 0.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 1, 1, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (2, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}', 2, 2, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (3, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 3, 3, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (4, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}', 4, 4, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (5, 42.00, 0.00, 'callLength', '{"callLengthInSeconds": 120}', 5, 5, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (6, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}', 6, 6, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (7, 0.00, 0.00, 'connectedCall', NULL, 7, 7, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (8, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}', 8, 8, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (9, 42.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}', 9, 9, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (10, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}', 10, 10, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (11, 40.00, 0.00, 'callLength', '{"callLengthInSeconds": 120}', 11, 11, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (12, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}', 12, 12, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (13, 55.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 180}', 13, 13, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (14, 50.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}', 14, 14, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (15, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 120}', 15, 15, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (16, 42.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 180}', 16, 16, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (17, 0.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 17, 17, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (18, 45.00, 0.00, 'callLength', '{"callLengthInSeconds": 120}', 18, 18, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (19, 55.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}', 19, 19, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (20, 40.00, 0.00, 'callLength', '{"callLengthInSeconds": 120}', 20, 20, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (21, 0.00, 0.00, 'callLength', '{"callLengthInSeconds": 120}', 21, 21, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (22, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}', 22, 22, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (23, 42.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}', 23, 23, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (24, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 60}', 24, 24, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (25, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 25, 25, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (26, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 26, 26, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (27, 42.00, 0.00, 'callLength', '{"callLengthInSeconds": 120}', 27, 27, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (28, 40.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 28, 28, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (29, 45.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}', 29, 29, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (30, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}', 30, 30, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (31, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnConnectedCall", "callLengthInSeconds": 90}', 31, 31, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (32, 40.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 32, 32, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (33, 40.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 33, 33, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (34, 42.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 34, 34, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (35, 45.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 35, 35, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (36, 0.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 36, 36, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (37, 50.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 37, 37, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (38, 45.00, 0.00, 'callLength', '{"callLengthInSeconds": 90}', 38, 38, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (39, 42.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 90}', 39, 39, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');
INSERT INTO contactcenter.call_conversion_settings VALUES (40, 55.00, 0.00, 'callLength', '{"startTimerEvent": "OnIncomingCall", "callLengthInSeconds": 120}', 40, 40, '2020-08-26 19:31:44.621581+00', '2020-08-26 19:31:44.621581+00');


--
-- Data for Name: dial_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.dial_settings VALUES (1, 1, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (2, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (3, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (4, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (5, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (6, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (7, 15, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (8, 1, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (9, 10, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (10, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (11, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (12, 1, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');
INSERT INTO contactcenter.dial_settings VALUES (13, 3, '2020-08-26 19:31:44.45825+00', '2020-08-26 19:31:44.45825+00');


--
-- Data for Name: duplicate_call_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.duplicate_call_settings VALUES (1, false, false, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (2, false, false, true, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (3, false, true, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (4, false, false, true, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (5, false, false, true, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (6, false, true, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (7, false, true, true, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (8, false, true, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (9, false, true, true, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (10, false, false, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (11, false, true, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (12, false, true, false, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');
INSERT INTO contactcenter.duplicate_call_settings VALUES (13, false, false, true, '2020-08-26 19:31:44.441718+00', '2020-08-26 19:31:44.441718+00');


--
-- Data for Name: mark_as_duplicate_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (1, 'ON_CALL_LENGTH', 120, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (2, 'ON_CONNECT', 0, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (3, 'ON_CALL_LENGTH', 120, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (4, 'ON_CONNECT', 0, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (5, 'ON_CONNECT', 0, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (6, 'ON_CALL_LENGTH', 180, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (7, 'ON_CALL_LENGTH', 90, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (8, 'ON_CALL_LENGTH', 120, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (9, 'ON_CALL_LENGTH', 120, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (10, 'ON_CALL_LENGTH', 120, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (11, 'ON_CALL_LENGTH', 90, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (12, 'ON_CALL_LENGTH', 120, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');
INSERT INTO contactcenter.mark_as_duplicate_settings VALUES (13, 'ON_CONNECT', 0, '2020-08-26 19:31:44.456707+00', '2020-08-26 19:31:44.456707+00');


--
-- Data for Name: record_call_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.record_call_settings VALUES (1, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (2, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (3, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (4, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (5, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (6, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (7, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (8, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (9, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (10, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (11, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (12, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');
INSERT INTO contactcenter.record_call_settings VALUES (13, true, true, false, true, '2020-08-26 19:31:44.473991+00', '2020-08-26 19:31:44.473991+00');


--
-- Data for Name: spam_detection_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.spam_detection_settings VALUES (1, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (2, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (3, 2, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (4, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (5, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (6, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (7, 2, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (8, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (9, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');
INSERT INTO contactcenter.spam_detection_settings VALUES (10, 0, false, '2020-08-26 19:31:44.437886+00', '2020-08-26 19:31:44.437886+00');


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.campaigns VALUES (1, 'MGLMailers', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 1, NULL, NULL, NULL, false, 'Medigap Mailers - MGL', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 1, 1, 1, 1, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (2, '', NULL, 'US', false, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, NULL, NULL, NULL, NULL, false, 'RaviTest', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 2, 2, 2, 2, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (3, 'TVPHXC11', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 2, NULL, NULL, NULL, false, 'SMS Transfers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 3, 3, 3, 3, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (4, '', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, NULL, NULL, NULL, NULL, false, 'RaviTest', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', false, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 4, 4, 4, 4, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (5, '', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 3, NULL, NULL, NULL, false, 'Toll Free IVR', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 5, 5, 5, 5, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (6, 'MGLDR', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 4, NULL, NULL, NULL, false, 'MAPD  Dedicated', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 6, 6, 6, 6, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (7, 'MGL-Charlie', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 5, NULL, NULL, NULL, false, 'MGL Charlie Transfers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 7, 7, 7, 7, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (8, 'MGL-Failover-Mailers', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 6, NULL, NULL, NULL, false, 'Mailers (RAW Calls Failover)', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 8, 8, 8, 8, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (9, 'MGLFB-Calls', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 7, NULL, NULL, NULL, false, 'MGL FB LiveCalls - Transfers', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 9, 9, 9, 9, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (10, 'CBSIN', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, true, 8, NULL, NULL, NULL, false, 'CBS Inbound', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 10, 10, 10, 10, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (11, 'FBTRANS', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 9, NULL, NULL, NULL, false, 'MGL FB Transfer', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 11, 11, 11, 11, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (12, 'MGLMailers', NULL, 'US', true, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, 10, NULL, NULL, NULL, false, 'Mailers (External Transfer)', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 12, 12, 12, 12, NULL, NULL);
INSERT INTO contactcenter.campaigns VALUES (13, '', NULL, 'US', false, 'WEIGHT_BY_TARGETS_AVAILABLE', NULL, NULL, true, false, NULL, NULL, NULL, NULL, false, 'RaviTest2', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', true, '2020-08-26 19:31:44.556969+00', '2020-08-26 19:31:44.556969+00', 13, 13, 13, 13, NULL, NULL);


--
-- Data for Name: campaign_affiliates; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.campaign_affiliates VALUES (1, 1, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (2, 3, '0cf5c6ef-4a62-4c99-8e20-77145e65e50c', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (3, 4, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (4, 5, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (5, 6, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (6, 6, '8359b084-aa49-4b84-b257-2d5e86fcae59', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (7, 7, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (8, 8, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (9, 9, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (10, 10, '5a4b7fce-4b46-421d-b97c-55aed10a07f5', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (11, 11, '14d344b9-93de-43e1-8264-94742e379f88', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');
INSERT INTO contactcenter.campaign_affiliates VALUES (12, 12, 'a01bc382-0505-4312-b481-374be22346b8', '2020-08-26 19:32:10.486168+00', '2020-08-26 19:32:10.486168+00');


--
-- Data for Name: campaign_call_routes; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.campaign_call_routes VALUES (1, 1, 1, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (2, 1, 2, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (3, 3, 3, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (4, 3, 4, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (5, 3, 5, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (6, 3, 6, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (7, 4, 7, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (8, 5, 8, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (9, 6, 9, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (10, 6, 10, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (11, 6, 11, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (12, 6, 12, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (13, 6, 13, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (14, 6, 14, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (15, 7, 15, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (16, 7, 16, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (17, 7, 17, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (18, 7, 18, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (19, 7, 19, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (20, 7, 20, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (21, 7, 21, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (22, 8, 22, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (23, 8, 23, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (24, 8, 24, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (25, 9, 25, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (26, 9, 26, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (27, 9, 27, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (28, 9, 28, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (29, 9, 29, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (30, 9, 30, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (31, 10, 31, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (32, 11, 32, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (33, 11, 33, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (34, 11, 34, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (35, 11, 35, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (36, 11, 36, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (37, 12, 37, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (38, 12, 38, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (39, 12, 39, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');
INSERT INTO contactcenter.campaign_call_routes VALUES (40, 12, 40, '2020-08-26 19:31:44.640395+00', '2020-08-26 19:31:44.640395+00');


--
-- Data for Name: tag_routing_tables; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.tag_routing_tables VALUES (2, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (3, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (4, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (5, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (6, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (7, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (8, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');
INSERT INTO contactcenter.tag_routing_tables VALUES (9, '2020-08-26 19:30:31.570632+00', '2020-08-26 19:30:31.570632+00');


--
-- Data for Name: criterias; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.criterias VALUES (1, 'EQUALS', 'OH', false, false, 2, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (2, 'EQUALS', 'VA', false, false, 2, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (3, 'EQUALS', 'AR', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (4, 'EQUALS', 'CO', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (5, 'EQUALS', 'CT', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (6, 'EQUALS', 'FL', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (7, 'EQUALS', 'GA', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (8, 'EQUALS', 'IN', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (9, 'EQUALS', 'KY', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (10, 'EQUALS', 'ME', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (11, 'EQUALS', 'NV', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (12, 'EQUALS', 'TN', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (13, 'EQUALS', 'TX', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (14, 'EQUALS', 'MO', false, false, 3, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (15, 'EQUALS', 'AL', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (16, 'EQUALS', 'AR', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (17, 'EQUALS', 'FL', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (18, 'EQUALS', 'GA', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (19, 'EQUALS', 'IN', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (20, 'EQUALS', 'KY', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (21, 'EQUALS', 'LA', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (22, 'EQUALS', 'MO', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (23, 'EQUALS', 'NJ', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (24, 'EQUALS', 'NC', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (25, 'EQUALS', 'OH', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (26, 'EQUALS', 'SC', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (27, 'EQUALS', 'TN', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (28, 'EQUALS', 'TX', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (29, 'EQUALS', 'VA', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (30, 'EQUALS', 'WV', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (31, 'EQUALS', 'WI', false, false, 4, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (32, 'EQUALS', 'AL', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (33, 'EQUALS', 'AZ', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (34, 'EQUALS', 'CO', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (35, 'EQUALS', 'FL', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (36, 'EQUALS', 'GA', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (37, 'EQUALS', 'IL', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (38, 'EQUALS', 'KY', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (39, 'EQUALS', 'LA', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (40, 'EQUALS', 'MD', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (41, 'EQUALS', 'MI', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (42, 'EQUALS', 'MS', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (43, 'EQUALS', 'MO', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (44, 'EQUALS', 'NV', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (45, 'EQUALS', 'OH', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (46, 'EQUALS', 'OK', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (47, 'EQUALS', 'PA', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (48, 'EQUALS', 'SC', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (49, 'EQUALS', 'TN', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (50, 'EQUALS', 'TX', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (51, 'EQUALS', 'VA', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (52, 'EQUALS', 'WI', false, false, 5, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (53, 'EQUALS', 'IN', false, false, 6, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (54, 'EQUALS', 'OH', false, false, 6, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (55, 'EQUALS', 'AL', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (56, 'EQUALS', 'AZ', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (57, 'EQUALS', 'AR', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (58, 'EQUALS', 'CA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (59, 'EQUALS', 'CO', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (60, 'EQUALS', 'CT', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (61, 'EQUALS', 'DE', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (62, 'EQUALS', 'FL', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (63, 'EQUALS', 'GA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (64, 'EQUALS', 'IA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (65, 'EQUALS', 'KS', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (66, 'EQUALS', 'KY', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (67, 'EQUALS', 'LA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (68, 'EQUALS', 'MD', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (69, 'EQUALS', 'MI', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (70, 'EQUALS', 'MN', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (71, 'EQUALS', 'MS', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (72, 'EQUALS', 'MO', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (73, 'EQUALS', 'MT', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (74, 'EQUALS', 'NE', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (75, 'EQUALS', 'NV', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (76, 'EQUALS', 'NH', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (77, 'EQUALS', 'NJ', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (78, 'EQUALS', 'NM', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (79, 'EQUALS', 'NC', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (80, 'EQUALS', 'ND', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (81, 'EQUALS', 'MP', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (82, 'EQUALS', 'OH', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (83, 'EQUALS', 'OK', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (84, 'EQUALS', 'OR', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (85, 'EQUALS', 'PA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (86, 'EQUALS', 'PR', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (87, 'EQUALS', 'SC', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (88, 'EQUALS', 'SD', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (89, 'EQUALS', 'TN', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (90, 'EQUALS', 'TX', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (91, 'EQUALS', 'UT', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (92, 'EQUALS', 'VA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (93, 'EQUALS', 'WA', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (94, 'EQUALS', 'WV', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (95, 'EQUALS', 'WY', false, false, 7, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', '', '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (96, 'EQUALS', 'AZ', false, false, 8, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (97, 'EQUALS', 'AR', false, false, 8, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (98, 'EQUALS', 'CA', false, false, 8, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (99, 'EQUALS', 'CO', false, false, 8, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (100, 'EQUALS', 'CT', false, false, 8, '2020-08-26 19:30:31.606318+00', '2020-08-26 19:30:31.606318+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (101, 'EQUALS', 'FL', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (102, 'EQUALS', 'GA', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (103, 'EQUALS', 'IL', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (104, 'EQUALS', 'IN', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (105, 'EQUALS', 'KY', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (106, 'EQUALS', 'LA', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (107, 'EQUALS', 'MS', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (108, 'EQUALS', 'MO', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (109, 'EQUALS', 'NV', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (110, 'EQUALS', 'NJ', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (111, 'EQUALS', 'NY', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (112, 'EQUALS', 'NC', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (113, 'EQUALS', 'OH', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (114, 'EQUALS', 'PA', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (115, 'EQUALS', 'SC', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (116, 'EQUALS', 'TN', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (117, 'EQUALS', 'TX', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (118, 'EQUALS', 'VA', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (119, 'EQUALS', 'WI', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (120, 'EQUALS', 'AL', false, false, 8, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (121, 'EQUALS', 'AZ', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (122, 'EQUALS', 'AR', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (123, 'EQUALS', 'CO', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (124, 'EQUALS', 'CT', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (125, 'EQUALS', 'FL', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (126, 'EQUALS', 'GA', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (127, 'EQUALS', 'IL', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (128, 'EQUALS', 'IN', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (129, 'EQUALS', 'KY', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (130, 'EQUALS', 'LA', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (131, 'EQUALS', 'MS', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (132, 'EQUALS', 'MO', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (133, 'EQUALS', 'NV', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (134, 'EQUALS', 'NJ', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (135, 'EQUALS', 'NY', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (136, 'EQUALS', 'NC', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (137, 'EQUALS', 'OH', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (138, 'EQUALS', 'PA', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (139, 'EQUALS', 'SC', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (140, 'EQUALS', 'TN', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (141, 'EQUALS', 'TX', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (142, 'EQUALS', 'VA', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (143, 'EQUALS', 'WI', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');
INSERT INTO contactcenter.criterias VALUES (144, 'EQUALS', 'CA', false, false, 9, '2020-08-26 19:30:31.624642+00', '2020-08-26 19:30:31.624642+00', NULL, '{InboundNumber:State}');


--
-- Data for Name: integration_conversion_sets; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: integrations; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: integration_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.knex_migrations VALUES (1, '20200713164029_app_configuration.js', 1, '2020-08-26 19:19:39.783+00');
INSERT INTO contactcenter.knex_migrations VALUES (2, '20200716123816_accounts.js', 1, '2020-08-26 19:19:39.792+00');
INSERT INTO contactcenter.knex_migrations VALUES (3, '20200716133738_buyers.js', 1, '2020-08-26 19:19:39.801+00');
INSERT INTO contactcenter.knex_migrations VALUES (4, '20200724155721_number_assignment_settings.js', 1, '2020-08-26 19:19:39.807+00');
INSERT INTO contactcenter.knex_migrations VALUES (5, '20200727122050_spam_detection_settings.js', 1, '2020-08-26 19:19:39.812+00');
INSERT INTO contactcenter.knex_migrations VALUES (6, '20200727133629_integrations.js', 1, '2020-08-26 19:19:39.819+00');
INSERT INTO contactcenter.knex_migrations VALUES (7, '20200727153809_routing_priorities.js', 1, '2020-08-26 19:19:39.824+00');
INSERT INTO contactcenter.knex_migrations VALUES (8, '20200727161824_integration_conversion_sets.js', 1, '2020-08-26 19:19:39.828+00');
INSERT INTO contactcenter.knex_migrations VALUES (9, '20200727163038_sip_numbers.js', 1, '2020-08-26 19:19:39.834+00');
INSERT INTO contactcenter.knex_migrations VALUES (10, '20200727172047_operation_times.js', 1, '2020-08-26 19:19:39.839+00');
INSERT INTO contactcenter.knex_migrations VALUES (11, '20200727173914_schedules_and_capacities.js', 1, '2020-08-26 19:19:39.844+00');
INSERT INTO contactcenter.knex_migrations VALUES (12, '20200728091522_criterias.js', 1, '2020-08-26 19:19:39.85+00');
INSERT INTO contactcenter.knex_migrations VALUES (13, '20200728133734_integration_settings.js', 1, '2020-08-26 19:19:39.861+00');
INSERT INTO contactcenter.knex_migrations VALUES (14, '20200728133916_targets.js', 1, '2020-08-26 19:19:39.884+00');
INSERT INTO contactcenter.knex_migrations VALUES (15, '20200728133947_call_instructions.js', 1, '2020-08-26 19:19:39.892+00');
INSERT INTO contactcenter.knex_migrations VALUES (16, '20200728134712_office_breaks.js', 1, '2020-08-26 19:19:39.909+00');
INSERT INTO contactcenter.knex_migrations VALUES (17, '20200728135026_open_settings.js', 1, '2020-08-26 19:19:39.927+00');
INSERT INTO contactcenter.knex_migrations VALUES (18, '20200728135448_tags.js', 1, '2020-08-26 19:19:39.936+00');
INSERT INTO contactcenter.knex_migrations VALUES (19, '20200728135704_numbers.js', 1, '2020-08-26 19:19:39.959+00');
INSERT INTO contactcenter.knex_migrations VALUES (20, '20200728135808_call_routes.js', 1, '2020-08-26 19:19:39.978+00');
INSERT INTO contactcenter.knex_migrations VALUES (21, '20200728140142_tag_routing_tables.js', 1, '2020-08-26 19:19:39.984+00');
INSERT INTO contactcenter.knex_migrations VALUES (22, '20200728140454_campaigns.js', 1, '2020-08-26 19:19:40.001+00');
INSERT INTO contactcenter.knex_migrations VALUES (23, '20200729022808_target_criterias.js', 1, '2020-08-26 19:19:40.007+00');
INSERT INTO contactcenter.knex_migrations VALUES (24, '20200729023243_sip_add_foreign_instruction.js', 1, '2020-08-26 19:19:40.011+00');
INSERT INTO contactcenter.knex_migrations VALUES (25, '20200729023532_criteria_add_foreign_tagroutablerule.js', 1, '2020-08-26 19:19:40.027+00');
INSERT INTO contactcenter.knex_migrations VALUES (26, '20200729024019_target_criteria_add_foreign_target_tagroutablerule.js', 1, '2020-08-26 19:19:40.037+00');
INSERT INTO contactcenter.knex_migrations VALUES (27, '20200729024221_target_add_foreign_call_instruction.js', 1, '2020-08-26 19:19:40.042+00');
INSERT INTO contactcenter.knex_migrations VALUES (28, '20200729031509_number_tags.js', 1, '2020-08-26 19:19:40.046+00');
INSERT INTO contactcenter.knex_migrations VALUES (29, '20200729031617_number_tag_add_foreign_number_tag.js', 1, '2020-08-26 19:19:40.05+00');
INSERT INTO contactcenter.knex_migrations VALUES (30, '20200729042529_campaign_call_routes.js', 1, '2020-08-26 19:19:40.055+00');
INSERT INTO contactcenter.knex_migrations VALUES (31, '20200729042649_campaign_call_route_add_foreign_campaign_call_route.js', 1, '2020-08-26 19:19:40.059+00');
INSERT INTO contactcenter.knex_migrations VALUES (32, '20200729092858_affiliates.js', 1, '2020-08-26 19:19:40.072+00');
INSERT INTO contactcenter.knex_migrations VALUES (33, '20200729093106_campaign_affiliates.js', 1, '2020-08-26 19:19:40.078+00');
INSERT INTO contactcenter.knex_migrations VALUES (34, '20200729093257_campaign_affiliate_add_foreign_campaign_affiliate.js', 1, '2020-08-26 19:19:40.081+00');
INSERT INTO contactcenter.knex_migrations VALUES (35, '20200730114550_number_add_foreign_keys.js', 1, '2020-08-26 19:19:40.088+00');
INSERT INTO contactcenter.knex_migrations VALUES (36, '20200730155346_numbers.js', 1, '2020-08-26 19:19:40.091+00');
INSERT INTO contactcenter.knex_migrations VALUES (37, '20200730163850_numbers.js', 1, '2020-08-26 19:19:40.093+00');
INSERT INTO contactcenter.knex_migrations VALUES (38, '20200804162602_criteria_add_col_tagids.js', 1, '2020-08-26 19:19:40.096+00');
INSERT INTO contactcenter.knex_migrations VALUES (39, '20200804234136_office_break_add_foreign_open_setting.js', 1, '2020-08-26 19:19:40.099+00');
INSERT INTO contactcenter.knex_migrations VALUES (40, '20200805074540_schedules_and_capacities_rename_timezone.js', 1, '2020-08-26 19:19:40.1+00');
INSERT INTO contactcenter.knex_migrations VALUES (41, '20200805131550_call_conversion_settings.js', 1, '2020-08-26 19:19:40.108+00');
INSERT INTO contactcenter.knex_migrations VALUES (42, '20200805135744_duplicate_settings.js', 1, '2020-08-26 19:19:40.112+00');
INSERT INTO contactcenter.knex_migrations VALUES (43, '20200805140521_call_conversion_setting_add_foreign_duplicate_setting.js', 1, '2020-08-26 19:19:40.115+00');
INSERT INTO contactcenter.knex_migrations VALUES (44, '20200805144017_duplicate_call_settings.js', 1, '2020-08-26 19:19:40.12+00');
INSERT INTO contactcenter.knex_migrations VALUES (45, '20200805144305_campaign_add_dupcall.js', 1, '2020-08-26 19:19:40.123+00');
INSERT INTO contactcenter.knex_migrations VALUES (46, '20200805160141_campaign_add_foreign_dupcall.js', 1, '2020-08-26 19:19:40.126+00');
INSERT INTO contactcenter.knex_migrations VALUES (47, '20200806110933_mark_as_duplicate_settings.js', 1, '2020-08-26 19:19:40.13+00');
INSERT INTO contactcenter.knex_migrations VALUES (48, '20200806111301_dial_settings.js', 1, '2020-08-26 19:19:40.133+00');
INSERT INTO contactcenter.knex_migrations VALUES (49, '20200806113934_record_call_settings.js', 1, '2020-08-26 19:19:40.139+00');
INSERT INTO contactcenter.knex_migrations VALUES (50, '20200806124044_campaign_add_dup_dial_record_settings.js', 1, '2020-08-26 19:19:40.142+00');
INSERT INTO contactcenter.knex_migrations VALUES (51, '20200806124719_campaign_foreign_dup_dial_record_settings.js', 1, '2020-08-26 19:19:40.146+00');
INSERT INTO contactcenter.knex_migrations VALUES (52, '20200807154555_open_settings_add_isoWeekday.js', 1, '2020-08-26 19:19:40.148+00');
INSERT INTO contactcenter.knex_migrations VALUES (53, '20200818181753_campaigns_add_workflowsid.js', 1, '2020-08-26 19:19:40.15+00');
INSERT INTO contactcenter.knex_migrations VALUES (54, '20200818182011_missed_calls.js', 1, '2020-08-26 19:19:40.157+00');
INSERT INTO contactcenter.knex_migrations VALUES (55, '20200819110603_campaigns_add_queuesid.js', 1, '2020-08-26 19:19:40.159+00');


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.knex_migrations_lock VALUES (1, 0);


--
-- Data for Name: missed_calls; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: number_assignment_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.number_assignment_settings VALUES (1, 'US', NULL, '561', NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (2, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (3, 'US', NULL, '607', NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (4, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (5, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (6, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (7, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (8, 'US', NULL, '831', NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (9, 'US', NULL, '954', NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (10, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (11, 'US', NULL, '561', NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');
INSERT INTO contactcenter.number_assignment_settings VALUES (12, 'US', NULL, NULL, NULL, NULL, false, '2020-08-26 19:32:26.718972+00', '2020-08-26 19:32:26.718972+00');


--
-- Data for Name: numbers; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.numbers VALUES (1, 'DRIPS Inbound', 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+15619486069', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 1, NULL, NULL, '2019-08-05 18:11:45.595373+00', '2020-07-05 00:00:00+00', '2020-08-03 00:00:00+00', '2020-07-03 23:00:13.415856+00', '0001-01-01 04:56:02+00', true, 5, false, false, 1, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(561) 948-6069', '15619486069', 'telnyx', '1299489388324979809', '1330775887238399268', '1330775887238399268', '{}');
INSERT INTO contactcenter.numbers VALUES (2, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+12142538449', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 3, NULL, NULL, '2020-02-26 16:59:41.251138+00', '2020-06-26 00:00:00+00', '2020-07-24 00:00:00+00', '2020-06-24 23:00:12.717183+00', '0001-01-01 04:56:02+00', true, 26, false, false, 2, false, 0, false, '0cf5c6ef-4a62-4c99-8e20-77145e65e50c', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(214) 253-8449', '12142538449', 'telnyx', '1299489388324979809', '1330770259145131974', '1330770259145131974', '{INTSET7b517314c20e448ab69ed1c0ff978fce}');
INSERT INTO contactcenter.numbers VALUES (3, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+16074639533', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 4, NULL, NULL, '2020-07-22 19:52:14.39812+00', '2020-07-22 00:00:00+00', '2020-08-20 00:00:00+00', '2020-07-22 00:00:00+00', '0001-01-01 04:56:02+00', true, 22, false, false, 3, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(607) 463-9533', '16074639533', 'telnyx', '1299489388324979809', '1421885263956674328', '', NULL);
INSERT INTO contactcenter.numbers VALUES (4, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+18203002464', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 5, NULL, NULL, '2020-02-28 22:13:16.844155+00', '2020-06-28 00:00:00+00', '2020-07-26 00:00:00+00', '2020-06-26 23:00:15.18505+00', '0001-01-01 04:56:02+00', true, 28, false, false, 4, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', NULL, '18203002464', 'telnyx', '1299489388324979809', '1344371865061164782', '1344371865061164782', NULL);
INSERT INTO contactcenter.numbers VALUES (5, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+18053197236', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 6, NULL, NULL, '2019-08-07 15:38:52.151843+00', '2020-07-07 00:00:00+00', '2020-08-05 00:00:00+00', '2020-07-05 23:00:15.806754+00', '0001-01-01 04:56:02+00', true, 7, false, false, 5, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(805) 319-7236', '18053197236', 'telnyx', '1299489388324979809', '1330780934395397158', '1330780934395397158', '{INTSETeb895f2c6692458cb39143aa284bcbe1}');
INSERT INTO contactcenter.numbers VALUES (6, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+18787770878', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 6, NULL, NULL, '2020-04-29 19:57:34.070953+00', '2020-06-29 00:00:00+00', '2020-07-27 00:00:00+00', '2020-06-27 23:00:19.953514+00', '0001-01-01 04:56:02+00', true, 29, false, false, 6, false, 0, false, '8359b084-aa49-4b84-b257-2d5e86fcae59', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(878) 777-0878', '18787770878', 'telnyx', '1299489388324979809', '1361006785279821077', '', NULL);
INSERT INTO contactcenter.numbers VALUES (7, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+14103192217', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 7, NULL, NULL, '2019-07-25 14:53:26.979544+00', '2020-06-25 00:00:00+00', '2020-07-23 00:00:00+00', '2020-06-23 23:00:15.976768+00', '0001-01-01 04:56:02+00', true, 25, false, false, 7, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(410) 319-2217', '14103192217', 'telnyx', '1299489388324979809', '1330770279923714012', '1330770279923714012', '{INTSET3f04f31733fe44809d2a74a1f670171a}');
INSERT INTO contactcenter.numbers VALUES (8, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+18312301558', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 8, NULL, NULL, '2020-06-24 15:28:53.473168+00', '2020-07-24 00:00:00+00', '2020-08-22 00:00:00+00', '2020-07-22 23:00:13.619483+00', '0001-01-01 04:56:02+00', true, 24, false, false, 8, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(831) 230-1558', '18312301558', 'telnyx', '1299489388324979809', '1401458996279248352', '', NULL);
INSERT INTO contactcenter.numbers VALUES (9, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+19544801751', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 9, NULL, NULL, '2019-11-01 19:19:08.94234+00', '2020-07-01 00:00:00+00', '2020-07-30 00:00:00+00', '2020-06-29 23:00:10.112361+00', '0001-01-01 04:56:02+00', true, 1, false, false, 9, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(954) 480-1751', '19544801751', 'telnyx', '1299489388324979809', '1330780766958782376', '1330780766958782376', '{INTSET51017f59b84e42b7bfcaeaa10ca6299c}');
INSERT INTO contactcenter.numbers VALUES (10, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+19282910542', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 10, NULL, NULL, '2020-03-30 20:27:14.117524+00', '2020-06-30 00:00:00+00', '2020-07-28 00:00:00+00', '2020-06-28 23:00:05.674131+00', '0001-01-01 04:56:02+00', true, 30, false, false, 10, false, 0, false, '5a4b7fce-4b46-421d-b97c-55aed10a07f5', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(928) 291-0542', '19282910542', 'telnyx', '1299489388324979809', '1339278450661263006', '1339278450661263006', '{INTSET7fec5024be0a4fa383892658ce145a51}');
INSERT INTO contactcenter.numbers VALUES (11, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+15614489237', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 11, NULL, NULL, '2019-10-26 14:40:31.74225+00', '2020-06-26 00:00:00+00', '2020-07-24 00:00:00+00', '2020-06-24 23:00:12.717183+00', '0001-01-01 04:56:02+00', true, 26, false, false, 11, false, 0, false, '14d344b9-93de-43e1-8264-94742e379f88', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(561) 448-9237', '15614489237', 'telnyx', '1299489388324979809', '1330775925171684731', '1330775925171684731', '{INTSETf28144bc60e34b7bad4e7b3fbdeb18e5}');
INSERT INTO contactcenter.numbers VALUES (12, NULL, 'e402b4fb-2887-4c1b-ae5c-df8b3e3ddbe0', NULL, '+19292017087', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, 12, NULL, NULL, '2020-02-26 18:06:31.122141+00', '2020-06-26 00:00:00+00', '2020-07-24 00:00:00+00', '2020-06-24 23:00:12.717183+00', '0001-01-01 04:56:02+00', true, 26, false, false, 12, false, 0, false, 'a01bc382-0505-4312-b481-374be22346b8', true, '2020-08-26 19:32:26.732603+00', '2020-08-26 19:32:26.732603+00', '(929) 201-7087', '19292017087', 'telnyx', '1299489388324979809', '1330780594790991655', '1330780594790991655', '{INTSETcad99f0b46234e2591fcb7981289397e}');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.tags VALUES (1, 'PlacementId', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (2, 'LandingPageId', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (3, 'LandingPageVersion', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (4, 'NumberPoolId', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (5, 'NumberPoolName', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (6, 'SearchTerm', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (7, 'SearchKeyWord', NULL, 'PlacementInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (8, 'UTCHour', NULL, 'Time', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (9, 'UTCMinute', NULL, 'Time', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (10, 'UTCSecond', NULL, 'Time', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (11, 'UTCWeekDay', NULL, 'Date', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (12, 'UTCDay', NULL, 'Date', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (13, 'UTCMonth', NULL, 'Date', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (14, 'UTCYear', NULL, 'Date', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (15, 'Name', NULL, 'Publisher', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (16, 'Company', NULL, 'Publisher', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (17, 'Id', NULL, 'Publisher', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (18, 'SubId', NULL, 'Publisher', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (19, 'ReplacementNumber', NULL, 'Publisher', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (20, 'Name', NULL, 'Campaign', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (21, 'Id', NULL, 'Campaign', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (22, 'TrackingId', NULL, 'Campaign', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (23, 'Number', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (24, 'Number-NoPlus', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (25, 'CountryCode', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (26, 'CountryDigits', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (27, 'AreaCode', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (28, 'IsPhoneNumberValid', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (29, 'Prefix', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (30, 'Suffix', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (31, 'Number', NULL, 'DialedNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (32, 'Name', NULL, 'DialedNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (33, 'Total', NULL, 'CallLength', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (34, 'FromConnect', NULL, 'CallLength', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (35, 'FromDial', NULL, 'CallLength', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (36, 'Name', NULL, 'Target', 'Connection', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (37, 'Id', NULL, 'Target', 'Connection', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (38, 'SubId', NULL, 'Target', 'Connection', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (39, 'Id', NULL, 'Buyer', 'Connection', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (40, 'Name', NULL, 'Buyer', 'Connection', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (41, 'SubId', NULL, 'Buyer', 'Connection', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (42, 'RecordingUrl', NULL, 'Recording', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (43, 'Country', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (44, 'CountryCode', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (45, 'SubDivision', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (46, 'SubDivisionCode', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (47, 'City', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (48, 'ZipCode', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (49, 'Latitude', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (50, 'Longitude', '', 'Geo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (51, 'IsMobile', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (52, 'UserAgentString', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (53, 'OS', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (54, 'OSVersion', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (55, 'Browser', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (56, 'BrowserVersion', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (57, 'IPAddress', '', 'Technology', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (58, 'ISP', '', 'ConnectionInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (59, 'OrganizationName', '', 'ConnectionInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (60, 'AutonomousName', '', 'ConnectionInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (61, 'AutonomousSystemNumber', '', 'ConnectionInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (62, 'ReferrerPage', '', 'RequestInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (63, 'LandingPageUrl', '', 'RequestInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (64, 'Width', '', 'ScreenInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (65, 'Height', '', 'ScreenInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (66, 'PixelDensity', '', 'ScreenInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (67, 'ColorDepth', '', 'ScreenInfo', 'JSTag', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (68, 'Region', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (69, 'State', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (70, 'Province', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (71, 'ProvinceCode', NULL, 'InboundNumber', 'Call', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (72, 'Sale', '', 'Target', 'User', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (73, 'First Name', '', 'firstname', 'User', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');
INSERT INTO contactcenter.tags VALUES (74, 'Last Name', '', 'lastname', 'User', NULL, '2020-08-26 19:28:43.35119+00', '2020-08-26 19:28:43.35119+00');


--
-- Data for Name: number_tags; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: operation_times; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.operation_times VALUES (1, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (2, 0, 21, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (3, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (4, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (5, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (6, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (7, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (8, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (9, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (10, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (11, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (12, 0, 16, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (13, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (14, 0, 15, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (15, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (16, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (17, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (18, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (19, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (20, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (21, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (22, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (23, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (24, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (25, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (26, 30, 16, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (27, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (28, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (29, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (30, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (31, 55, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (32, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (33, 55, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (34, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (35, 55, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (36, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (37, 55, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (38, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (39, 55, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (40, 40, 16, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (41, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (42, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (43, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (44, 0, 21, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (45, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (46, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (47, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (48, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (49, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (50, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (51, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (52, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (53, 0, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (54, 0, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (55, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (56, 0, 15, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (57, 10, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (58, 0, 18, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (59, 30, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (60, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (61, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (62, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (63, 30, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (64, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (65, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (66, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (67, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (68, 10, 17, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (69, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (70, 10, 15, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (71, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (72, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (73, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (74, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (75, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (76, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (77, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (78, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (79, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (80, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (81, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (82, 10, 18, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (83, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (84, 10, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (85, 10, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (86, 0, 18, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (87, 10, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (88, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (89, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (90, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (91, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (92, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (93, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (94, 15, 19, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (95, 5, 9, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (96, 10, 17, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (97, 0, 10, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (98, 10, 15, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (99, 0, 6, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (100, 59, 23, '2020-08-26 19:30:31.564345+00', '2020-08-26 19:30:31.564345+00');
INSERT INTO contactcenter.operation_times VALUES (101, 0, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (102, 59, 23, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (103, 0, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (104, 59, 23, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (105, 0, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (106, 59, 23, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (107, 0, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (108, 59, 23, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (109, 0, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (110, 59, 23, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (111, 0, 6, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (112, 59, 23, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (113, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (114, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (115, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (116, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (117, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (118, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (119, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (120, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (121, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (122, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (123, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (124, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (125, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (126, 0, 21, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (127, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (128, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (129, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (130, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (131, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (132, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (133, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (134, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (135, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (136, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (137, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (138, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (139, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (140, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (141, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (142, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (143, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (144, 10, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (145, 30, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (146, 10, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (147, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (148, 10, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (149, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (150, 10, 18, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (151, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (152, 5, 15, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (153, 0, 10, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (154, 0, 15, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (155, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (156, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (157, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (158, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (159, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (160, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (161, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (162, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (163, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (164, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (165, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (166, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (167, 0, 9, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (168, 0, 19, '2020-08-26 19:30:31.570567+00', '2020-08-26 19:30:31.570567+00');
INSERT INTO contactcenter.operation_times VALUES (169, 0, 9, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (170, 0, 21, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (171, 0, 9, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (172, 0, 19, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (173, 0, 9, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (174, 0, 19, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (175, 0, 9, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (176, 0, 19, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (177, 0, 9, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (178, 0, 19, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (179, 0, 9, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (180, 0, 16, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (181, 0, 10, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');
INSERT INTO contactcenter.operation_times VALUES (182, 0, 15, '2020-08-26 19:32:42.723701+00', '2020-08-26 19:32:42.723701+00');


--
-- Data for Name: open_settings; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.open_settings VALUES (1, 1, 2, false, true, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (2, 3, 4, false, false, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (3, 5, 6, false, false, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (4, 7, 8, false, false, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (5, 9, 10, false, false, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (6, 11, 12, false, false, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (7, 13, 14, false, false, 1, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (8, 15, 16, false, true, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (9, 17, 18, false, false, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (10, 19, 20, false, false, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (11, 21, 22, false, false, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (12, 23, 24, false, false, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (13, 25, 26, false, false, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (14, 27, 28, false, true, 2, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (15, 29, 30, false, true, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (16, 31, 32, false, false, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (17, 33, 34, false, false, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (18, 35, 36, false, false, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (19, 37, 38, false, false, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (20, 39, 40, false, false, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (21, 41, 42, false, true, 3, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (22, 43, 44, false, true, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (23, 45, 46, false, false, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (24, 47, 48, false, false, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (25, 49, 50, false, false, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (26, 51, 52, false, false, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (27, 53, 54, false, false, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (28, 55, 56, false, false, 4, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (29, 57, 58, false, true, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (30, 59, 60, false, false, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (31, 61, 62, false, false, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (32, 63, 64, false, false, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (33, 65, 66, false, false, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (34, 67, 68, false, false, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (35, 69, 70, false, true, 5, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (36, 71, 72, false, true, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (37, 73, 74, false, false, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (38, 75, 76, false, false, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (39, 77, 78, false, false, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (40, 79, 80, false, false, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (41, 81, 82, false, false, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (42, 83, 84, false, true, 7, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (43, 85, 86, false, true, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (44, 87, 88, false, false, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (45, 89, 90, false, false, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (46, 91, 92, false, false, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (47, 93, 94, false, false, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (48, 95, 96, false, false, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (49, 97, 98, false, true, 8, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (50, 99, 100, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (51, 101, 102, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (52, 103, 104, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (53, 105, 106, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (54, 107, 108, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (55, 109, 110, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (56, 111, 112, false, false, 9, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (57, 113, 114, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (58, 115, 116, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (59, 117, 118, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (60, 119, 120, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (61, 121, 122, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (62, 123, 124, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (63, 125, 126, false, false, 10, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (64, 127, 128, false, true, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (65, 129, 130, false, false, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (66, 131, 132, false, false, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (67, 133, 134, false, false, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (68, 135, 136, false, false, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (69, 137, 138, false, false, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (70, 139, 140, false, true, 11, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (71, 141, 142, false, true, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (72, 143, 144, false, false, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (73, 145, 146, false, false, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (74, 147, 148, false, false, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (75, 149, 150, false, false, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (76, 151, 152, false, false, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (77, 153, 154, false, false, 12, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (78, 155, 156, false, true, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (79, 157, 158, false, false, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (80, 159, 160, false, false, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (81, 161, 162, false, false, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (82, 163, 164, false, false, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (83, 165, 166, false, false, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (84, 167, 168, false, false, 13, '2020-08-26 19:30:31.60204+00', '2020-08-26 19:30:31.60204+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (85, 169, 170, false, true, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (86, 171, 172, false, false, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (87, 173, 174, false, false, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (88, 175, 176, false, false, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (89, 177, 178, false, false, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (90, 179, 180, false, false, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);
INSERT INTO contactcenter.open_settings VALUES (91, 181, 182, false, false, 14, '2020-08-26 19:32:42.72983+00', '2020-08-26 19:32:42.72983+00', NULL);


--
-- Data for Name: office_breaks; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: sip_numbers; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--



--
-- Data for Name: target_criterias; Type: TABLE DATA; Schema: contactcenter; Owner: mogxugftnygukt
--

INSERT INTO contactcenter.target_criterias VALUES (1, 2, 2, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (2, 3, 3, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (3, 5, 4, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (4, 7, 5, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (5, 8, 6, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (6, 10, 7, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (7, 12, 8, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');
INSERT INTO contactcenter.target_criterias VALUES (8, 13, 9, '2020-08-26 19:30:31.643612+00', '2020-08-26 19:30:31.643612+00');


--
-- Name: app_configuration_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.app_configuration_id_seq', 3, true);


--
-- Name: call_conversion_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.call_conversion_settings_id_seq', 40, true);


--
-- Name: call_instructions_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.call_instructions_id_seq', 14, true);


--
-- Name: call_routes_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.call_routes_id_seq', 40, true);


--
-- Name: campaign_affiliates_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.campaign_affiliates_id_seq', 12, true);


--
-- Name: campaign_call_routes_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.campaign_call_routes_id_seq', 40, true);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.campaigns_id_seq', 1, false);


--
-- Name: criterias_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.criterias_id_seq', 144, true);


--
-- Name: dial_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.dial_settings_id_seq', 13, true);


--
-- Name: duplicate_call_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.duplicate_call_settings_id_seq', 13, true);


--
-- Name: duplicate_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.duplicate_settings_id_seq', 40, true);


--
-- Name: integration_conversion_sets_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.integration_conversion_sets_id_seq', 1, false);


--
-- Name: integration_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.integration_settings_id_seq', 1, false);


--
-- Name: integrations_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.integrations_id_seq', 1, false);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.knex_migrations_id_seq', 55, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.knex_migrations_lock_index_seq', 1, true);


--
-- Name: mark_as_duplicate_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.mark_as_duplicate_settings_id_seq', 13, true);


--
-- Name: missed_calls_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.missed_calls_id_seq', 1, false);


--
-- Name: number_assignment_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.number_assignment_settings_id_seq', 12, true);


--
-- Name: number_tags_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.number_tags_id_seq', 1, false);


--
-- Name: numbers_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.numbers_id_seq', 12, true);


--
-- Name: office_breaks_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.office_breaks_id_seq', 1, false);


--
-- Name: open_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.open_settings_id_seq', 91, true);


--
-- Name: operation_times_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.operation_times_id_seq', 182, true);


--
-- Name: record_call_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.record_call_settings_id_seq', 13, true);


--
-- Name: routing_priorities_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.routing_priorities_id_seq', 40, true);


--
-- Name: schedules_and_capacities_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.schedules_and_capacities_id_seq', 14, true);


--
-- Name: sip_numbers_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.sip_numbers_id_seq', 1, false);


--
-- Name: spam_detection_settings_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.spam_detection_settings_id_seq', 10, true);


--
-- Name: tag_routing_tables_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.tag_routing_tables_id_seq', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.tags_id_seq', 74, true);


--
-- Name: target_criterias_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.target_criterias_id_seq', 8, true);


--
-- Name: targets_id_seq; Type: SEQUENCE SET; Schema: contactcenter; Owner: mogxugftnygukt
--

SELECT pg_catalog.setval('contactcenter.targets_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

