var myArray = [ {'Name' : '평가자1','e_item':'업무수행', 'Grade' : '9', 'Comment' : '업무수행에 있어서 완성된 결과를 산출'}, 
                {'Name' : '평가자1', 'e_item':'커뮤니케이션','Grade' : '9', 'Comment' : '업무수행에 있어서 완성된 결과를 산출'}, 
            ] 


buildTable(myArray) 

function buildTable(data) { 
    var table = document.getElementById('table1') 
    
    for (var i=0; i < data.length; i++) { 
        var row = `<tr> 
                    <td>${data[i].Name}</td>
                    <td>${data[i].e_item}</td>
                    <td>${data[i].Grade}</td>  
                    <td>${data[i].Comment}</td> 
                    </tr>` 
        table.innerHTML += row 
    } 
}

