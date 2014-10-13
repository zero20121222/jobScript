#!/bin/csh 

cat ./requirement-dubbo-provider.xml | grep '<dubbo:service' | sed "s/<dubbo:service //;s/><\/>//;s/=/[NUM]=/g;s/\"\ /\";/g" | while read line;do 
    echo "${line//NUM/${i:-0}}" 
    ((i++)) 
done >/tmp/source 
. /tmp/source 
rm /tmp/source 
for((j=0; j<${#id[@]}; j++));do 
   echo -e "id[$j]: ${id[j]}\nartist[$j]: ${artist[j]}\ntitle[$j]: ${title[j]}" 
done

# cat ./requirement-dubbo-provider.xml | grep '<dubbo:service'|sed "s/<dubbo:service //;s/><\/>//;s/interface=/interface[NUM]=/;s/ref=/ref[NUM]=/;s/\"\ /\";/g" | while read line;do 
#     echo "${line//NUM/${i:-0}}" 
#     ((i++)) 
# done >/tmp/source 
# . /tmp/source 
# rm /tmp/source 
# for((j=0; j<${#id[@]}; j++));do 
#    echo -e "id[$j]: ${id[j]}\nartist[$j]: ${artist[j]}\ntitle[$j]: ${title[j]}" 
# done 