
/*MODULE PATTERN*/
//CALORIES MODULE CONTROLLER    
var caloriesController = (function(){
 
    var AddCal = function(id,description,calories,quantity){
        this.id = id;
        this.description = description;
        this.calories = calories;
        this.quantity = quantity;
    };
    var BurnCal = function(id,description,calories,quantity){
        this.id = id;
        this.description = description;
        this.calories = calories;
        this.quantity = quantity;
    };
    var storage = {
        allCalories:{
             add : [],
             burn : []
        },
        all:{
            add:0,
            burn:0
        },
        totalCaloriesPerDay :0,
        minCalPerDay:2500,
        percentage : 0,
        remaining : 0
    };
    var totalCalories = function(type){
        //1. LOOP THROUGH THE ARRAY BASED ON ITS TYPE
        var total = 0;
        /*FOREACH ACCEPTS CALLBACK FUNCTION WITH 3 PARAMETERS, CURRENT VALUE, CURRENT INDEX AND THE ENTIRE ARRAY
           index  0  1  2  3
           add = [5,55,105,36]

            total = 0;
            1. total = total + 5 = 0 +5 = 5
            2. total = total + 55 = 5 + 55 = 60
            3. total = total + 105 = 60 + 105 = 165
            4. total = total + 36 = 165 + 36 = 201
         */
        storage.allCalories[type].forEach(function(current){
            total +=(current.calories)*(current.quantity);
        });
        //INSIDE OUR GLOBAL STORAGE OBJ ADD ANOTHER OBJ WHERE WE STORE THE TOTAL VALUE OF THE ADD AND BURNED CALORIES
        storage.all[type] = total;
    };
    return {
        addCalory:function(inputObj){
            var type, description, calories,quantity,newCalory,id,caloryLength, calArray;
            type = inputObj.type;
            description = inputObj.description;
            calories = inputObj.calories;
            quantity = inputObj.quantity;   
            caloryLength = storage.allCalories[type].length;
            calArray = storage.allCalories[type];
            //id = lastInsertedId + 1;
            if(caloryLength>0){
                id = calArray[caloryLength - 1].id + 1;
            }
            else{
                id = 0;
            }
            if(type ==='add'){
                newCalory = new AddCal(id,description,calories,quantity);
            }
            else if(type ==='burn'){
                newCalory = new BurnCal(id,description,calories,quantity);
            }
            storage.allCalories[type].push(newCalory);
           //RETURN ADDED CALORIE OBJ, FOR UI DOM MANIPULATION
            return newCalory;
        },
        //CALCULATE THE CALORIES
        computeCalories : function(){
            totalCalories('add'); // 205
            totalCalories('burn');//165
            //totalCaloriesPerDay = 205 - 165 = 40;
            //CALCULATE AND STORE IT BACK TO OUR GLOBAL STORAGE totalCaloriesPerDay
            storage.totalCaloriesPerDay = storage.all.add - storage.all.burn;
             //CALCULATE AND STORE IT BACK TO OUR GLOBAL STORAGE REMAINING CALORIES
             storage.remaining = storage.minCalPerDay - storage.totalCaloriesPerDay;
             //CALCULATE AND STORE THE PERCENTAGE
             // percentage = (700 / 2300)*100 => 30.43
             storage.percentage = Math.round((storage.totalCaloriesPerDay/storage.minCalPerDay)*100);
        },
        //GET DATA FROM THE STORAGE, AND RETURN IT AS ON OBJ
        returnCalories:function(){
            return{
                todayCalories:storage.totalCaloriesPerDay,
                totalAdded : storage.all.add,
                totalBurned : storage.all.burn,
                remaining : storage.remaining,
                percentage : storage.percentage  
            }
        },
        //DELETE CALORIE
        deleteCalory: function(id,type){
            var arrayIds,currentPosition;
            //array.map(function(currentValue,index,arr))
            arrayIds = storage.allCalories[type].map(function(curr){
                return curr.id;
            });
           // console.log(storage.allCalories[type]);
            currentPosition = arrayIds.indexOf(id);
            if(currentPosition !==-1){
                storage.allCalories[type].splice(currentPosition,1);
            }
        },
        //RETURN THE ENTIRE STORAGE OBJ
        result:function(){
            return storage;
        }
    };
})();

//UI MODULE CONTROLLER
var AppUIController = (function(){
    //HTML CSS CLASS NAMES PRIVATE OBJ
    var htmlClassNames = {
        typeClass : '.showForm__type',
        descriptionClass : '.showForm__description__input',
        caloriesClass : '.showForm__add-calories',
        quantityClass :'.quantity', 
        addBtnClass:'.showForm__add-btn',
        foodSlider:'.food__slider',
        exerciseSlider:'.exercise__slider',
        foodBtn : '.btn-panel__food--apple',
        exerciseBtn:'.btn-panel__food--fire',
        frontAppResultRemainingCal:'.totalCal__remaining',
        frontAppFoodPanelCal:'.main-panel__result--food-cal',
        frontAppExercisePanelCal:'.main-panel__result--exercise-cal',
        frontAppRemainText: '.remaining',
        frontAppPercentageValue:'.circlePercentageValue',
        frontAppChart:'.chart__circle',
        frontAppDatePercent:'.main-panel__date--percent',
        mainPanel:'.main-panel',
        fontAppDate:'.main-panel__date--text',
        errorNotification:'.error',

    };
    //MONTHS OBJ
        var months = {
            0:'January', 
            1:'February',
            2:'March', 
            3:'April',
            4:'May', 
            5:'June', 
            6:'July', 
            7:'August', 
            8:'September', 
            9:'October', 
            10:'November', 
            11:'December'
        };
        //DAYS ARR
        var days = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ];
        //FORMAT CALORIES FOR THE FRONT UI
        var formatCalories = function(num){
            //Syntax : str.substr(start,len)
            var splitArrNum,firstInt,decimalPart,formattedNum;
            num = Math.abs(num);
            num = num.toFixed(2);
            splitArrNum = num.split('.');
            firstInt = splitArrNum[0];
            decimalPart =  splitArrNum[1];
            if(firstInt.length>3){
                firstInt = firstInt.substr(0,firstInt.length-3)+ ','+ firstInt.substr(firstInt.length-3,3);
            }
            formattedNum = firstInt +'.'+decimalPart;
            return formattedNum;
        };
        //FORMAT REMAINING CALORIES IN OUR GRAPH CHART
         var formatRemaining = function(num){
            //Syntax : str.substr(start,len)
            num = Math.round(num);
            num = num.toString();
            if(num.length>3){
                num = num.substr(0,num.length-3)+ ','+ num.substr(num.length-3,3);
            }
            return num;
        };
  
       var list = function(formFields){
        return Array.prototype.slice.call(formFields);
       };
    //PUBLIC
    return{
        //RETURN OBJ WITH FORM FIELDS VALUES
        getFormData : function(){
            return {
                type: document.querySelector(htmlClassNames.typeClass).value,
                description: document.querySelector(htmlClassNames.descriptionClass).value,
                calories: parseFloat(document.querySelector(htmlClassNames.caloriesClass).value),
                quantity: parseInt(document.querySelector(htmlClassNames.quantityClass).value),
            };
        },
        //RETURN CLASS NAME OBJ
        getHtmlClassName:function(){
            return htmlClassNames;
        },
        //TO DISPLAY THE ITEM TO THE UI
        addItem:function(itemObj, type){
            var markup,editedMarkup,sliderContainer,notification;

            if(type ==='add'){
                sliderContainer = htmlClassNames.foodSlider;
                notification ='<i class="fas fa-apple-alt"></i><span class="btn-panel__food--text">+ Food</span><div class="circle-container"><div class="pulsate"></div><div class="circle"></div></div>';
                markup = '<div class="food-container__foods" id="add-%id%"><div class="food-container__foods--name">%description%</div><div class="food-container__foods--calBalance">Calorie Balance<span class="food-container__foods--cal">+%calories%Cal</span><div class="food-container__foods--bar"></div></div><div class="food-container__foods--delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button> </div></div>';
                document.querySelector(htmlClassNames.foodBtn).innerHTML = notification;
                document.querySelector(htmlClassNames.exerciseBtn).innerHTML = ' <i class="fas fa-fire"></i><span class="btn-panel__food--text exercise-burn-text"> - Exercise</span>';
            }
            else if(type ==='burn'){
                sliderContainer = htmlClassNames.exerciseSlider;
                notification ='<i class="fas fa-fire"></i><span class="btn-panel__food--text exercise-burn-text"> - Exercise</span><div class="circle-container"><div class="pulsate"></div><div class="circle"></div> </div>';
                markup = '<div class="food-container__foods running-container__name" id="burn-%id%"><div class="food-container__foods--name running-container__name"> %description%</div><div class="food-container__foods--calBalance running__calBalance">Calorie Burned<span class="food-container__foods--cal  running__calBalance--cal"> -%calories%Cal</span><div class="food-container__foods--bar  running__calBalance--bar"></div></div><div class="food-container__foods--delete running-container__delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button> </div></div>';
                document.querySelector(htmlClassNames.exerciseBtn).innerHTML = notification;
                document.querySelector(htmlClassNames.foodBtn).innerHTML = '<i class="fas fa-apple-alt"></i><span class="btn-panel__food--text">+ Food</span>';
            }
            //DOM MANIPULATION, WE ARE GOING TO PLACE THE HTML MARKUP BACK TO THE DOM USING REPLACE STRING METHOD
            editedMarkup = markup.replace('%id%', itemObj.id);
            editedMarkup = editedMarkup.replace('%description%', itemObj.description);
            editedMarkup = editedMarkup.replace('%calories%', formatCalories(itemObj.calories));
            document.querySelector(sliderContainer).insertAdjacentHTML('beforeend', editedMarkup);
        },
        //DISPLAY THE RESULT BACK TO UI
        displayFrontAppCalories:function(calObj){
            var editedPercentagePath = '';
            var todayCalories, totalAdded, totalBurned, remaining, percentage;
            todayCalories = calObj.todayCalories;
            totalAdded = calObj.totalAdded;
            totalBurned = calObj.totalBurned;
            remaining = calObj.remaining;
            percentage = calObj.percentage;
            var percentagePath = '<path class="circle-bg"d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/> <path class="circle circlePercentageValue"stroke-dasharray="%percentage%, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>';
            document.querySelector(htmlClassNames.frontAppRemainText).innerHTML = '<span class="remaining">Remaining</span>';
            document.querySelector(htmlClassNames.frontAppFoodPanelCal).textContent = '+ '+ formatCalories(totalAdded);
            document.querySelector(htmlClassNames.frontAppExercisePanelCal).textContent = '- '+ formatCalories(totalBurned);
            document.querySelector(htmlClassNames.frontAppDatePercent).textContent = percentage+'%';

            if(remaining>1300){
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:rgba(0,230,64,1);">'+formatRemaining(remaining)+'</span>';
                editedPercentagePath = percentagePath.replace('%percentage%',percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            }
            else if(remaining < 1300 && remaining >500){
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:rgba(191,85,236,1);">'+formatRemaining(remaining)+'</span>';
                editedPercentagePath = percentagePath.replace('%percentage%',percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            }
 
            else if( remaining < 500 && remaining > 0){
                document.querySelector(htmlClassNames.frontAppRemainText).innerHTML = '<span class="remaining" style="color:rgba(226,106,106,1);"><i class="fa fa-exclamation-circle fa-spin fa-3x fa-fw" style="font-size:22px;"></i>Remaining</span>';
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:rgba(207,0,15,1);">'+formatRemaining(remaining)+'</span>';
                editedPercentagePath = percentagePath.replace('%percentage%',percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            }
            else if( remaining < 0){
                document.querySelector(htmlClassNames.frontAppRemainText).innerHTML = '<span class="remaining" style="color:rgb(233, 210, 210);"><i class="fa fa-exclamation-circle fa-spin fa-3x fa-fw" style="font-size:38px;"></i>Over The Limit</span>';
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = '<span style="color:rgba(207,0,15,1);">'+formatRemaining(remaining)+'!!</span>';
                editedPercentagePath = percentagePath.replace('%percentage%',percentage);
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editedPercentagePath;
            }
        },
        //DELETE CALORY FROM UI
        deleteCaloryFromUI: function(divID){
            var parentPanel,actualChild;
            parentPanel = document.getElementById(divID).parentNode;
            actualChild = document.getElementById(divID);
            parentPanel.removeChild(actualChild);
        },
        //DISPLAY DATE, MONTH, YEAR AND DAY
        displayDate: function(){
            var today,year,date,monthName,dayName,formattedText;
            today = new Date();
            year = today.getFullYear();
            date = today.getDate();
            monthName = months[today.getMonth()];
            dayName = days[today.getDay()];
            formattedText = `${dayName},${date} ${monthName} ${year}`;
            document.querySelector(htmlClassNames.fontAppDate).innerHTML = '<span>'+formattedText+'</span>';
        },
        //CLEAR SUBMIT FORM
        clearForm:function(){
            var formFields,formFieldsArr;
            formFields = document.querySelectorAll(htmlClassNames.descriptionClass + ','+htmlClassNames.caloriesClass +','+htmlClassNames.quantityClass);
            // console.log(formFields);
           formFieldsArr = list(formFields);
        //    console.log(formFieldsArr);
            formFieldsArr.forEach(function(curr,index,arr){
                curr.value = '';
            });
        

        },
    };
})();

//MAIN MODULE CONTROLLER
var MainController = (function(caloriesCtrl,AppUICtrl){

    var htmlClassNames =  AppUICtrl.getHtmlClassName();
    var groupEventListeners = function (){
        // ADD FORM BTN CALL
        document.querySelector(htmlClassNames.addBtnClass).addEventListener('click',function(e){
            addCalories();
            e.preventDefault();
        });
        //KEYPRESS EVENT LISTENER FOR RETURN/ENTER KEY
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13){
                addCalories();
                e.preventDefault();
            }
        });

        //EVENT DELEGATION WHEN DELETE BTN IS CLICKED
        document.querySelector(htmlClassNames.mainPanel).addEventListener('click',function(e){
            deleteCalories(e);
        });
    };

    // ADD CALORIES FN
    var addCalories = function(){
        var getFormInput,newAddCalorie;
        //READ INPUT DATA
        getFormInput = AppUICtrl.getFormData();
        if(getFormInput.description !=="" && !isNaN(getFormInput.calories) && getFormInput.calories>0 && !isNaN(getFormInput.quantity) && getFormInput.quantity>0){
            //ADD NEW CALORIE
            newAddCalorie = caloriesCtrl.addCalory(getFormInput);
           // console.log(caloriesCtrl.result());
            //ADD THE INSERTED CALORIE FROM ABOVE TO THE UI
            AppUICtrl.addItem(newAddCalorie,getFormInput.type);
            //CALCULATE RELATED FNS
            calculateCalories();
             //CLEAR THE FORM FIELDS
             AppUICtrl.clearForm();
             document.querySelector(htmlClassNames.errorNotification).innerHTML = '';
        }
        else{
            document.querySelector(htmlClassNames.errorNotification).innerHTML = ' <i class="fas fa-exclamation-circle"></i> Please Fill The Form Correctly';
        }
        
    };
    //CALORIES CALCULATIONS FN
    var calculateCalories = function(){
        var calories;
        //CALCULATE CALORIES 
        caloriesCtrl.computeCalories();
        //GET COMPUTED CALORIES FROM computeCalories Fn, AND DATA FROM totalCalories
        calories = caloriesCtrl.returnCalories();
        //console.log(calories);
        //DISPLAY THE COMPUTED CALORIES TO THE FRONT UI
        AppUICtrl.displayFrontAppCalories(calories);
    };

     // DELETE CALORIES
     var deleteCalories = function(e){
       var parentNode,getId,id,type;
        //console.log(e.target.parentNode.parentNode.parentNode.id);
       parentNode = e.target.parentNode.parentNode.parentNode.id;
       if(parentNode){
           // add-0, add-1 // burn-0,burn-1
           getId = parentNode.split('-');
           id = parseInt(getId[1]);
           type = getId[0];
        //DELETE THE ITEM FROM OUR STORAGE OBJ WITH THE ID AND TYPE
        caloriesCtrl.deleteCalory(id,type);
        //DELETE THE CALORIES FROM UI
        AppUICtrl.deleteCaloryFromUI(parentNode);
        //SHOW UPDATED VALUES IN THE STORAGE
        calculateCalories();
       }
      
    };
    //PUBLIC
    return{
        initialize:function(){
            //console.log('The APP is initiated');
            emptyCal = {
                todayCalories : 0,
                totalAdded : 0,
                totalBurned : 0,
                remaining : 2500,
                percentage : 0,
            };
            AppUICtrl.displayFrontAppCalories(emptyCal);
  
            // AppUICtrl.displayFrontAppCalories(emptyCal = {
            //     todayCalories : 0,
            //     totalAdded : 0,
            //     totalBurned : 0,
            //     remaining : 2300,
            //     percentage : 0,
            // });
           groupEventListeners(); 
           AppUICtrl.displayDate();
         
        }
    }
})(caloriesController,AppUIController);

MainController.initialize();

/*
RESET FORM INPUT FIELDS 
*/



