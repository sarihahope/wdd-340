-- insert TOney, Stark, tony@starkent.com, IAM1ronM@n into account table.
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'IAM1ronM@n');


--modify the Toney Stark record
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;


--Delete the Toney Stark
DELETE FROM public.account
WHERE account_id = 1;



--Replace the words in the 'GM Hummer'  'small interiors' to 'a huge interior'
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';



--inner joiin 

SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';


--Add '/vehicles' tot he middle of the file path in the inv_image and inv_thumbnail columns
UPDATE public.inventory
SET inv_image = CONCAT(SUBSTRING(inv_image, 1, 8), '/vehicles', SUBSTRING(inv_image, 9)),
inv_thumbnail = CONCAT(SUBSTRING(inv_thumbnail, 1, 8), '/vehicles', SUBSTRING(inv_thumbnail, 9));





