import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';
import appConfig from '../../config.json';

export default function ButtonEnviar (){
    return(

        <Button
type='submit'
label='enviar'
buttonColors={{
    contrastColor: appConfig.theme.colors.neutrals["000"],
    mainColor: appConfig.theme.colors.primary[500],
    mainColorLight: appConfig.theme.colors.primary[400],
    mainColorStrong: appConfig.theme.colors.primary[600],
   


}}



/>
    )
}
