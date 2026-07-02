# SportGroup

Aplicativo mobile para conectar pessoas que querem praticar esportes em grupo.

Desenvolvido com Expo (React Native) e Supabase.

---

## Tecnologias

- Expo / React Native
- Supabase
- Expo Router
- AsyncStorage

---

## Instalação

```bash
npm install
npx expo install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sua-key-aqui
```

Os valores estão em Supabase Dashboard > Settings > API.

Nunca suba o `.env.local` para o repositório.

---

## Banco de dados

Tabelas no Supabase, nessa ordem de criação:

1. `usuarios` — perfil público vinculado ao auth.users
2. `grupos` — grupos esportivos
3. `membros_grupo` — relação usuário x grupo
4. `eventos` — eventos criados dentro dos grupos
5. `participantes_evento` — inscrições nos eventos


---

## Conexão com o Supabase

Arquivo em `src/utils/supabase.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

---

## Rodando o projeto

```bash
npx expo start
```