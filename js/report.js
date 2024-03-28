$( window ).on( "load", readyFn );

function readyFn(){
   Store.get(['report'], (e) => {
     if(e.report !== undefined){
        console.log(e.report)

        var x = 1;
        e.report.forEach(function (row) {


            let l = 'No';
            if (row.s)
               l = 'Yes';
           
            let y =  `<tr>
                  <th scope="row">${x}</th>
                  <td><a target="_blank" href="${row.g}">${row.g}</td>
                  <td>${l}</td>
                </tr>`;


                $('tbody').append(y)
                x++;

        })
     }
   });
}