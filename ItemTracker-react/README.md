# itemsNplayers

This is my first Fullstack application where I was mainly learning react on the go.

### How does it work?

The table data is organised into third normal form:

- Players with their **player_tag** and **player_id**
- Items with their **item_name**, **item_id** and **item_qty**
- Linking table which links two ids together and a quantity for that link

When duplicate players are entered an error should be returned but for items, the quanity should increase.

### How to run it?

Start by running the **main.py** located in **.venv**, followed by the react app.

If you don't know how to run a react app:

- open a bash terminal
- cd into the **ItemTracker-react** folder
- type **'npm install'**  to install any dependancies
- then type **'npm run dev'**