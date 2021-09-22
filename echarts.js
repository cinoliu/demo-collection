echarts设置滑过可点击区域时将鼠标变为小手样式（一般与区域点击事件结合使用）

myChart.getZr().on('mousemove', param => {

        var pointInPixel= [param.offsetX, param.offsetY];

          if (myChart.containPixel('grid',pointInPixel)) {

              myChart.getZr().setCursorStyle('pointer')

          }else{

            myChart.getZr().setCursorStyle('default')

          }

    })



echarts2 饼图标签文字换行

label：{
    formatter

function(e){
　　　　 var newStr=" ";
        var start,end;
 　　　　var name_len=e.name.length;    　　　　　　　　　　　　   //每个内容名称的长度
 　　　　var max_name=4;    　　　　　　　　　　　　　　　　　　//每行最多显示的字数
 　　　　var new_row = Math.ceil(name_len / max_name); 　　　　// 最多能显示几行，向上取整比如2.1就是3行
 　　　　if(name_len>max_name){ 　　　　　　　　　　　　　　  //如果长度大于每行最多显示的字数
  　　　　　　for(var i=0;i<new_row;i++){ 　　　　　　　　　　　   //循环次数就是行数
   　　　　　　　　var old='';    　　　　　　　　　　　　　　　　    //每次截取的字符
   　　　　　　　　start=i*max_name;    　　　　　　　　　　     //截取的起点
  　　　　　　　　 end=start+max_name;    　　　　　　　　　  //截取的终点
   　　　　　　　　if(i==new_row-1){    　　　　　　　　　　　　   //最后一行就不换行了
    　　　　　　　　　　old=e.name.substring(start);
   　　　　　　　　}else{
    　　　　　　　　　　old=e.name.substring(start,end)+"\n";    
  　　　　　　　　 }
   　　　　　　　　　　 newStr+=old; //拼接字符串
 　　　　　　  }
　　　   }else{                                          //如果小于每行最多显示的字数就返回原来的字符串
  　　　　　　newStr=e.name; 
 　　　  }
 　　　 return newStr;
　　}
}，


//整条柱形的点击事件


myChart.getZr().on('click', params => {
          let pointInPixel = [params.offsetX, params.offsetY]
          if (myChart.containPixel('grid', pointInPixel)) {
            let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
            console.log(xIndex)
          }
        })



//echarts 折线图阴影颜色渐变
series: [
          {
            data: count,
            type: "line",
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "red" },
                  { offset: 0.5, color: "pink" },
                  { offset: 1, color: "black" }
                ])
              }
            }, //填充区域样式
            lineStyle: {
              color: "#00b5ff",
              width: 1
            }, //线条的样式
            itemStyle: {
              color: "rgb(255, 70, 131)",
              opacity: 0 //为0不会绘制图形拐点消失
            } //拐点的样式
          }
        ],


        //Echarts设置柱状图渐变色
        series: [{
    itemStyle: {
        normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "red" // 0% 处的颜色
            }, {
                offset: 0.6,
                color: "blue" // 60% 处的颜色
            }, {
                offset: 1,
                color: "yellow" // 100% 处的颜色
            }], false)
        }
    }
}]