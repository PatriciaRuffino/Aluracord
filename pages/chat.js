import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from '@supabase/supabase-js';

import { useRouter } from 'next/router';
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
/* import ButtonEnviar from "../src/components/ButtonEnviar"; */




const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ2ODg3NywiZXhwIjoxOTU5MDQ0ODc3fQ.AalB3p_Lfx_Er56t5kux6z3SuauVhVMUtMKMBONcL5g'
const SUPABASE_URL = 'https://cdqjjcmgudwwinxrdrci.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



function escutaMensagemEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new)

        })
        .subscribe()
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);


    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                // console.log('Dados da consulta:', data)
                setListaDeMensagens(data)

            })
        const subscription = escutaMensagemEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);
            setListaDeMensagens((valorAtualDaLista) => {
                console.log('valorAtualDaLista:', valorAtualDaLista);
                return [

                    novaMensagem,
                    ...valorAtualDaLista,
                ]

            });
        });


        return () => {
            subscription.unsubscribe();
        }

    }, []);




    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,

        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {
                console.log("criando mensansagem:", data)
            });

        setMensagem('');

    }

    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: 'url(https://preview.redd.it/rau8ofogtd661.jpg?width=960&crop=smart&auto=webp&s=3ff87b5746799f6c2012a6c804bd7a3735d9ada8)',
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[500],
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >

                    {/* <MessageList mensagens={[]} /> */}
                    <MessageList mensagens={listaDeMensagens} />

                    {/*  Lista de Mensagens: {listaDeMensagens.map((mensagemAtual) => {
                       
                        return(
                            <li key={mensagemAtual.id}>
                               {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                           
                        )
                        
                    })}
 */}


                    <Box
                        as="form"
                        onSubmit={function submit(event) {
                            event.preventDefault();
                            /*  console.log("alguém submeteu alguma coisa") */
                            handleNovaMensagem(mensagem);
                        }}
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);

                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }

                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClock={(sticker) => {
                                //console.log('Salva o sticker no banco', sticker);
                                handleNovaMensagem(':sticker:' + sticker)
                            }}
                        />
                        {/*     <ButtonEnviar /> */}

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>
                <Button
                    variant="tertiary"
                    colorVariant="neutral"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList(props) {

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px",
                backgroundImage: 'url(https://i.pinimg.com/736x/e0/a6/3d/e0a63d1790d21bc3c3a62ed3073d79e0.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',

            }}
        >

            {props.mensagens.map((mensagem) => {
                return (

                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            marginLeft: "12px",
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],

                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />

                            <Text tag="strong">
                                {mensagem.de}
                                </Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':stiker:')
                            ? (
                                <Image src={mensagem.texto.replace(':sticker:', '')} />
                            )
                            : (
                                mensagem.texto
                            )}
                    </Text>
                )
            })}
        </Box>
    );
}







