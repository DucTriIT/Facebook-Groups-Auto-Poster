MsgListener.addListener((res, sender, sendResponse) => {
    if(res.total){
        

         setTimeout(()=>{
                $('.gp-counter-body .processed span').text(res.total-res.index)
                $('.gp-counter-body .total span').text(res.total)
            },500)

    }
})