import { useAuthUser, useEmailSigninMutation } from '@/utils/adminHook';
import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiImage,
  EuiLink,
  EuiLoadingSpinner,
  EuiPanel,
  EuiSpacer,
  EuiTitle
} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Login = () => {
  const { isLoading: isEmailSigninLoading, isError: isEmailSigninError, error: emailSigninError,isSuccess:isEmailSigninSuccess, mutateAsync: emailSigninMutation } = useEmailSigninMutation(false)
  const { data, mutateAsync: authAdmin } = useAuthUser()
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err,setErr]=useState<string|undefined>('')
    const router = useRouter()
    const handleLogin = async () =>{
      console.log("email:",email)
      console.log("password:",password)
      if (email.length==0 || password.length==0){
        setErr("Please Enter Valid Credentials")
      }else{
        setErr(undefined)
      }
      try{
        if (err==undefined && email.length>0 && password.length>0){
          await emailSigninMutation({
            email,
            password,
            userName:''
          })
        }
      }catch(e){
        console.log("error on login:",e)
      }
    }
    
    useEffect(() => {
      const validateSession = async (token: string) => {
          try {
              await authAdmin(token)
              router.push('/')
          } catch (e) {
              console.log("session not found: " + e)
              router.push('/login')
          }
      }
      const token = window.localStorage.getItem('token');

      if (token == null) {
          router.push('/login')
      }
      if (token != null) {
          validateSession(token)
      }
  }, [router, authAdmin]);

  return (
    <div className="login-container">
      <EuiPanel className="login-panel">
        <EuiFlexGroup direction="column" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiImage size="xl" alt='Datasack Solution' color={'#FFA500'} src='/logo_icon.png' style={{backgroundColor:'white',width:'50px'}}  />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTitle size="m">
              <h2>Admin <span style={{color:'orange'}}>Login</span></h2>
            </EuiTitle>
          </EuiFlexItem>
          {isEmailSigninLoading && <EuiLoadingSpinner size='l' />}
          <EuiSpacer size="s" />
          {isEmailSigninError && (
                <EuiFormRow>
                  <div style={{ color: 'red', textAlign:'center' }}>{emailSigninError.response?.data.message || emailSigninError.message}</div>
                </EuiFormRow>
              )}
          {err && <p style={{color:'red'}}>{err}</p>}
          <EuiFlexItem grow={false} style={{ width: '100%' }}>
            <EuiForm component="form">
            <EuiFormRow label="Email">
                <EuiFieldText
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                    setErr(undefined)
                  }}
                />
              </EuiFormRow>
              <EuiFormRow label="Password">
                <EuiFieldPassword
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value); 
                    setErr(undefined)}}
                />
              </EuiFormRow>
              <EuiSpacer size="m" />
              <EuiFlexGroup justifyContent="spaceBetween">
                <EuiFlexItem grow={false}>
                  <EuiLink href="/forgotPassword">Forgot Password?</EuiLink>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton type='button' fill onClick={handleLogin}>
                    Login
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiForm>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    </div>
  );
};

export default Login;
