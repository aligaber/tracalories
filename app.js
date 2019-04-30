//Storage controller
const StorageCtrl = (function(){

    //public methods
    return{
        storeItem:function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                //set to items LS
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.push(item);
                //set to items LS
                localStorage.setItem('items',JSON.stringify(items));
            }
        },
        getItemsFromStorage:function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage:function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) =>{
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items',JSON.stringify(items));
        },
        deleteItemFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) =>{
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items',JSON.stringify(items));
        },
        clearItemsFromStorage:function(){
            localStorage.removeItem('items');
        }
    }
})();


/*######################################################################*/
                                    //Item controller
const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name , calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data structure / state
    const data = {
        // items: [
        //     // {id:0, name:'Steak Dinner',calories: 1200 },
        //     // {id:1, name:'Cookie',calories: 400 },
        //     // {id:2, name:'Eggs',calories: 300 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currnetItem: null,
        totalCalories: 0
    }

    
    //public methods
    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
          let ID;
            //Generate ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            //create new item
           const newItem = new Item(ID,name,calories);

            //add item to items array
            data.items.push(newItem);

            return newItem;
        },
        deleteItem:function(id){
            const ids = data.items.map(item => item.id);

            const index = ids.indexOf(id);

            data.items.splice(index,1);
        },
        clearAllItems:function(){
            data.items = [];
        },
        getItemById:function(id){
            let found;
            data.items.forEach((item) => {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem(item){
            data.currnetItem = item;
        },
        getTotalCalories:function(){
            let total = 0;
            // calculate the total calories
            data.items.forEach((item) => {
                total += item.calories;
            })
            
            // set total to the data structure
            data.totalCalories = total;

            // return the total 
            return total;
        },
        updateItem:function(name, calories){
            // calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach((item) => {
                if(item.id === data.currnetItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        getCurrentItem:function(){
            return data.currnetItem;
        },
        logData: function(){
            return data;
        }
    }
})();

/*##############################################################################*/

                                    //UI controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '.list-group',
        listItems:'.list-group-item',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // public methods
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `
                <li class="list-group-item list-group-item-action" id="item-${item.id}">
                    <strong>${item.name} : </strong> <em>${item.calories}</em>
                    <a href="#" class="pull-right"><i class="fa fa-pencil edit-item"></i></a>
                </li>
                `;                
            });

            //insert items into ui
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function(){
            return UISelectors;
        },
        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            let html = '';

            html += `
            <li class="list-group-item list-group-item-action" id="item-${item.id}">
                <strong>${item.name} : </strong> <em>${item.calories}</em>
                <a href="#" class="pull-right"><i class="fa fa-pencil edit-item"></i></a>
            </li>
            `;     
            
            document.querySelector(UISelectors.itemList).innerHTML += html;
        },
        showTotalCalories:function(total){
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearInputs: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm:function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearEditState:function(){
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState:function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updateListItem:function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
       
            //convert nodeList to array
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name} : </strong> <em>${item.calories}</em>
                        <a href="#" class="pull-right"><i class="fa fa-pencil edit-item"></i></a>
                        `;     
                }
            })
        },
        deleteListItem: function(id){
            document.querySelector(`#item-${id}`).remove();
             // get total calories
             const totalCalories = ItemCtrl.getTotalCalories();

             // show total calories
             UICtrl.showTotalCalories(totalCalories);
             //clear edite state
            UICtrl.clearEditState();
        },
        removeItems:function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // convert to array 
            listItems = Array.from(listItems);

            listItems.forEach(item => item.remove());
        }

    }
})();

/*######################################################################################*/
                                        //App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    //Load event listeners
    const loadEventListeners = function(){

        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

         //item updata submit event
         document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
         
         //item delete submit event
         document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

         //back button
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

         //clear button
         document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

         // disable add on enter
         document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
         });
    }

    //Add item submit
    const itemAddSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //check for nae and calorie input
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show total calories
            UICtrl.showTotalCalories(totalCalories);

            //store item in Local Storage
            StorageCtrl.storeItem(newItem);

            // clear inputs
            UICtrl.clearInputs();
        }


        e.preventDefault();
    }


    //item Edit click
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //get list id
            const listId = e.target.parentNode.parentNode.id;
            
            const listIdArr = listId.split('-');

            //get actual id
            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }


        e.preventDefault();
    }

    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){

            const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

            //update the UI
            UICtrl.updateListItem(updatedItem);
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // show total calories
            UICtrl.showTotalCalories(totalCalories);
            //update local storage
            StorageCtrl.updateItemStorage(updatedItem);
            // clear inputs
            UICtrl.clearEditState();
        }
        e.preventDefault();
    }

    //item delete submit
    const itemDeleteSubmit = function(e){
        const currnetItem = ItemCtrl.getCurrentItem();
        //Delete from data structure
        ItemCtrl.deleteItem(currnetItem.id);
        //delete list item
        UICtrl.deleteListItem(currnetItem.id);
        //delete from storage
        StorageCtrl.deleteItemFromStorage(currnetItem.id);
        e.preventDefault();
    }

    //clear all items
    const clearAllItemsClick = function(e){
        //clear the data structure
        ItemCtrl.clearAllItems();
        //remove items from UI
        UICtrl.removeItems();
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // show total calories
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.hideList(); 
        //clear items from storage
        StorageCtrl.clearItemsFromStorage();  
        e.preventDefault();
    }

    //public methods
    return{
        init: function(){
            //set clear state
            UICtrl.clearEditState();
            
            // Fetch items
            const items = ItemCtrl.getItems();
            
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //populate list with fetched items
                UICtrl.populateItemList(items);
                // get total calories
                const totalCalories = ItemCtrl.getTotalCalories();
                // show total calories
                UICtrl.showTotalCalories(totalCalories);
            }
            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


//initialize app
App.init();