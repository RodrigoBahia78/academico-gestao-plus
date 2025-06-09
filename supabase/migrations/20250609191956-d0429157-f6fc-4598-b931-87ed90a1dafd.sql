
-- Corrigir o role do usuário Rodrigo de 'professor' para 'diretor'
UPDATE public.user_profiles 
SET role = 'diretor'::user_role_type 
WHERE email = 'rodrigo.diretor@escola.edu.br';
