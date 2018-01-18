
jQuery.fn.extend({
  renderSurvey: function(jsonInput) {
    //something great

    addFont('Montserrat:300|Raleway:300')

    const answers = []

    let survey = renderForm(jsonInput)
    survey.append(renderQuestion(jsonInput.question))
    survey.append(renderAnswerContainer(jsonInput.answers))
    survey.append(renderOptionalInput())
    survey.append(renderSubmit())
    
    this.append(survey)

    // Select
    $(document).on('click', '.not-active', function() {
      $(this).addClass('active')
      $(this).removeClass('not-active')
      $(this).append(renderSelected())
      answers.push($(this).attr('choice'))
      
    })

    // De-select
    $(document).on('click', '.active', function() {
      $(this).children('.selected').remove()
      $(this).addClass('not-active')
      $(this).removeClass('active')
      answers.splice(answers.indexOf($(this).attr('choice')), 1)
    })


    $(document).on('click', '#survey-submit', function(e) {
      e.preventDefault()
      if (answers.length === 0) {
        
        $('.prompt').remove()
        survey.append('<p class="prompt" style="text-align:center">You must select at least one given color to continue</p>')
      }
      else {
        $('.message').remove()

        $.post({
          url: `https://cors-anywhere.herokuapp.com/${jsonInput.submitUrl}`,
          data: {
            answer: answers,
            other_answer: $('#other').val().trim()
          },
          success: function() {
            console.log('it worked!')
            $('.prompt').remove()
            survey.append('<p class="prompt" style="text-align:center">Thank you for you answer!</p>')

          },
          error: function() {
            console.log('something appears to have gone wrong! Please try again')
          }
        })
      }
      
    })

  }
})

function renderForm(jsonInput) {
  return $('<form>').css({
    'background-color': 'white',
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'padding': '20px',
    'font-family': 'Raleway, Montserrat, sans-serif',
  })
}

function renderQuestion(question) {
  let questionHeader = $('<h1>').css({'text-align': 'center'})
  return questionHeader.text(question)
}

function renderAnswerContainer(answers) {
  let answerContainer = $('<div>').css({
    'margin': '0 auto',
    'display': 'flex',
    'justify-content': 'center',
    'flex-wrap': 'wrap',
    'width': '60%'
  })

  answers.forEach(function(answer) {
    answerContainer.append(renderAnswerDiv(answer))
  })

  return answerContainer
}

function renderAnswerDiv(input) {
  const answerDiv = $('<div>').css({
    'border-radius': '4px',
    'height': '40px',
    'width': '40%',
    'background-color': '#ADD8E6',
    'color': 'blue',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'space-between',
    'margin': '10px',
    'padding': '0 10px 0 10px',
    'cursor': 'pointer',
  }).addClass('answer not-active').attr('choice', input)
  

  let answer = $('<p>').text(input)
  answerDiv.append(answer)
  return answerDiv
}

function renderOptionalInput() {
  let container = $('<div>').css({'display': 'flex', 'justify-content': 'center'})
  let optionalInputDiv = $('<div>').css({
    'background-color': '#ADD8E6',
    'border-radius': '4px',
    'margin': '10px',
    'padding-left': '10px',
    'width': '200px',
  })

  let input = $('<input type="text" name="optional">').css({'display': 'inline-block', 'border-radius': '4px'}).attr('id', 'other')
  let label = $('<p>').text('Other: ').css({
    'display': 'inline-block', 
    'margin': '5px',
    'color': 'blue'})
  
  return container.append(optionalInputDiv.append(label).append(input))
}


function renderSubmit() {
  return $('<button type="submit" id="survey-submit">').text('Submit').css({
    'background-color': '#428bca',
    'border-radius': '4px',
    'color': 'white',
    'font-size': '14px',
    'margin': '0px auto',
    'padding': '10px 20px 10px 20px',
    'height': '40px',
    'width': '210px',
    'cursor': 'pointer',
  })
}

function renderSelected() {
  return $('<div>').css({
    'background-color': 'green',
    'border-radius': '50%',
    'height': '10px',
    'width': '10px',
    'z-index': '20'
  }).attr('class', 'selected')

}

function addFont(fontName) {
  $('head').append(`<link href='https://fonts.googleapis.com/css?family=${fontName}' rel='stylesheet' type='text/css'>`)
}
