Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5004/classify_image";

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            /* 
            Below is a sample response if you have two faces in an image lets say virat and roger together.
            Most of the time if there is one person in the image you will get only one element in below array
            data = [
                {
                    class: "viral_kohli",
                    class_probability: [1.05, 12.67, 22.00, 4.5, 91.56],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                },
                {
                    class: "roder_federer",
                    class_probability: [7.02, 23.7, 52.00, 6.1, 1.62],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                }
            ]
            */
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
            let players = ["lionel_messi", "maria_sharapova", "roger_fedrer", "serena_williams", "virat_kohli","ronaldo","neymar_jr","ab_de_villiers","lebron_james"];
            let des=["<b>Virat Kohli</b> is an Indian international cricketer and former captain of the Indian national team who plays as a right-handed batsman for Royal Challengers Bangalore in the IPL and for Delhi in Indian domestic cricket. Widely regarded as one of the greatest batsmen of all time.[3] Kohli holds the record for scoring most runs in both T20 internationals and in IPL. In 2020, the International Cricket Council named him as player of decade. Kohli has also contributed to India's successes, including winning the 2011 World Cup and the 2013 Champions trophy.","<b>Maria Yuryevna Sharapova</b>,is a Russian former world No. 1 tennis player. She competed on the WTA Tour from 2001 to 2020 and was ranked world No. 1 in singles by the Women's Tennis Association (WTA) for 21 weeks. She is one of ten women, and the only Russian, to achieve the career Grand Slam. She is also an Olympic medalist, having won silver in women's singles at the 2012 London Olympics.",
                    "<b>Roger Federer</b> is a Swiss former professional tennis player. He was ranked world No. 1 by the Association of Tennis Professionals (ATP) for 310 weeks, including a record 237 consecutive weeks, and finished as the year-end No. 1 five times. He won 103 ATP singles titles, the second most of all time, including 20 major men's singles titles, a record eight men's singles Wimbledon titles, an Open Era joint-record five men's singles US Open titles, and a joint-record six year-end championships. In his home country, he is regarded as 'the greatest and most successful' Swiss sportsperson in history.[4]","<b>Lionel Andrés Messi</b>, also known as Leo Messi, is an Argentine professional footballer who plays as a forward for Ligue 1 club Paris Saint-Germain and captains the Argentina national team. Widely regarded as one of the greatest players of all time, Messi has won a record seven Ballon d'Or awards,[note 2] a record six European Golden Shoes, and in 2020 was named to the Ballon d'Or Dream Team.",
                    "<b>Serena Jameka Williams</b> is an American inactive professional tennis player. Considered among the greatest tennis players of all time,[a] she was ranked world No. 1 in singles by the Women's Tennis Association (WTA) for 319 weeks, including a joint-record 186 consecutive weeks, and finished as the year-end No. 1 five times. She won 23 Grand Slam singles titles, the most by any player in the Open Era, and the second-most of all time. She is the only player, male or female, to accomplish a Career Golden Slam in both singles and doubles.","<b>Cristiano Ronaldo</b> dos Santos Aveiro GOIH ComM  is a Portuguese professional footballer who plays as a forward for and captains both Saudi Professional League club Al Nassr and the Portugal national team. Widely regarded as one of the greatest players of all time, Ronaldo has won five Ballon d'Or awards and four European Golden Shoes, the most by a European player",
                    "<b>Abraham Benjamin de Villiers </b>is a former South African international cricketer. AB de Villiers was named as the ICC ODI Player of the Year three times during his 15-year international career and was one of the five Wisden cricketers of the decade at the end of 2019. He is regarded as one of the greatest cricketers in the history of the sport and the best batsman of his era. AB de Villiers began his international career as a wicket-keeper-batsman, but he has played most often solely as a batsman. He batted at various positions in the batting order, but predominantly in the middle-order.","<b>Neymar da Silva Santos Júnior </b>, known as Neymar, is a Brazilian professional footballer who plays as a forward for Ligue 1 club Paris Saint-Germain and the Brazil national team. A prolific goalscorer and renowned playmaker, he is regarded as one of the best players in the world, as well as one of the greatest Brazilian footballers of all time.Neymar has scored at least 100 goals for three different clubs, making him one of four players to achieve this.",
                    "<b>LeBron Raymone James Sr</b>  is an American professional basketball player for the Los Angeles Lakers in the National Basketball Association (NBA). Nicknamed 'King James', he is considered to be one of the greatest basketball players in history and is often compared to Michael Jordan in debates over the greatest basketball player of all time.[a] James is the all-time leading scorer in NBA history and ranks fourth in career assists."];
            let match = null;
            let bestScore = -1;
            //let ind=-1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                    //console.log(match.class)
                }
            }
            if (match) {
                
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                var myElement = document.getElementById('my-element');
                var name=document.getElementById('name');
                let m=match.class
                if(match.class=="virat_kohli"){
                    console.log("Hi")
                    myElement.innerHTML = des[0];
                    name.innerHTML="Virat Kohli";
                }
                else if(match.class=='maria_sharapova'){
                    myElement.innerHTML = des[1];
                    name.innerHTML="Maria Sharapova";
                }
                else if(match.class=='roger_fedrer'){
                    myElement.innerHTML = des[2];
                    name.innerHTML="Roger Fedrer";
                }
                else if(match.class=='lionel_messi'){
                    myElement.innerHTML = des[3];
                    name.innerHTML="Lionel Messi";
                }
                else if(match.class=='serena_williams'){
                    myElement.innerHTML = des[4];
                    name.innerHTML="Serena Williams"
                }
                else if(match.class == "ronaldo"){
                    console.log("BYe")
                    myElement.innerHTML = des[5];
                    name.innerHTML="Ronaldo";
                }
                else if(match.class=='ab_de_villiers'){
                    myElement.innerHTML = des[6];
                    name.innerHTML="Ab De Villiers";
                }
                else if(match.class=="neymar_jr"){
                    myElement.innerHTML = des[7];
                    name.innerHTML="Neymar Jr";
                }
                else if(match.class=="lebron_james"){
                    console.log("Bye");
                    myElement.innerHTML = des[8];
                    name.innerHTML="Lebron James";
                }

                let classDictionary = match.class_dictionary;
                //console.log(classDictionary)
                for(let personName in classDictionary) {
                    //console.log(personName)
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);

                }
            }
            // dz.removeFile(file);            
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});