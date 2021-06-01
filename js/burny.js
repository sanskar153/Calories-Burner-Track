//for food panel slider

var slider = document.querySelector('.food-slider');

//for adding new items

var showForm = document.querySelector('.showForm');

//exercise Slider

var exerciseSlider = document.querySelector('.exercise-slider');

//close btn for closing all of the opened panel
var sliderCloseBtn = document.querySelector('#sliderCloseBtn');
// //on click events
sliderCloseBtn.addEventListener('click',closeSlides,false);
var btnPanel = document.addEventListener('click',function(e){
    if(e.target.classList.contains('fa-apple-alt') || e.target.classList.contains('fa-plus-circle') || e.target.classList.contains('fa-fire')){
        if(e.target.classList.contains('fa-apple-alt')){
            showForm.classList.add('closed');
            exerciseSlider.classList.add('closed'); 
            slider.classList.toggle('closed');
        }
        else if(e.target.classList.contains('fa-plus-circle')){
            slider.classList.add('closed');
            exerciseSlider.classList.add('closed'); 
            showForm.classList.toggle('closed');
        }
        else if(e.target.classList.contains('fa-fire')){
            slider.classList.add('closed');
            showForm.classList.add('closed'); 
            exerciseSlider.classList.toggle('closed');  
        }
    }
});

function closeSlides(){
    //remove all of the classes opened
    slider.classList.remove('opened');
    exerciseSlider.classList.remove('opened');
    showForm.classList.remove('opened');
    //add back closed class to the slides 
    slider.classList.add('closed');
    exerciseSlider.classList.add('closed');
    showForm.classList.add('closed');

}

