let getData = function(url) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url);

        xhr.onload = function() {
            if (xhr.status == 200)
            {
                resolve(xhr.response)
            }
            else
            {
                reject(xhr.responseText)
            }
        }

        xhr.onerror = function() {
            reject(Error("Network Error"))
        }

        xhr.send()
    })
}


getData('http://jservice.io/api/categories?count=5&offset=10')
    .then(res => {

        var categoryData = JSON.parse(res)
        let questionsArray = []

        var categoriesList = document.getElementsByClassName("box category")
        var questionsList = document.getElementsByClassName("box question")

        for(var i = 0; i < categoriesList.length; i++)
        {
            categoriesList[i].innerHTML = categoryData[i].title
            var categoryId = categoryData[i].id

            var thisData = getData('http://jservice.io/api/category?id=' + categoryId)

            questionsArray.push(thisData)
        }

        Promise.all(questionsArray)
            .then(res => {
                
                var cluesData = []

                for(var categoryQuestions of res)
                {
                    cluesData.push(JSON.parse(categoryQuestions))
                }

                for(var i = 0; i < cluesData.length; i++)
                {
                    var questionData = cluesData[i].clues

                    for(var j = 0; j < 5; j++)
                    {
                        questionElement = questionsList[i+(j*5)]
                        questionElement.innerHTML = questionData[j].value
                        questionElement.setAttribute("question", questionData[j].question)
                        questionElement.setAttribute("answer", questionData[j].answer)
                        questionElement.setAttribute("isClicked", "false")
                        console.log(questionData[j].answer)

                        questionElement.addEventListener("click", (e) => {
                            let el = e.target

                            if(el.getAttribute("isClicked") == "false")
                            {
                                el.innerHTML = el.getAttribute("question")
                                el.setAttribute("isClicked", "true")
                            }
                            else
                            {
                                el.innerHTML = el.getAttribute("answer")
                                el.style.backgroundColor = "#2f81c3"
                                el.style.color = "#ffffff"
                            }

                        })
                    }
                }
            })

            .catch(e => {
                alert(e);
            })
})
