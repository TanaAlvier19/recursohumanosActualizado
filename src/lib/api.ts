export const buscarDados = async () => {
        try {
            const res = await fetch("https://avdserver.up.railway.app/usuariologado/",
                {
                    credentials:"include",
                }
            );
            if(res.status===403 || res.status===401){
              return null;
            }
            const dados = await res.json();
            console.log(dados)
            return dados
        } catch (err) {
            alert("Erro: " + err);
        }
    };
export const buscarModulos = async () => {
        try {
            const res = await fetch("https://avdserver.up.railway.app/modulos/",
                {
                    credentials:"include",
                }
            );
            if(res.status===403 || res.status===401){
              return null;
            }
            const dados = await res.json();
            console.log(dados)
            return dados
        } catch (err) {
            alert("Erro: " + err);
        }
    };