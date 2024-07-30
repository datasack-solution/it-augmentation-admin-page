import { useEmailSigninMutation } from '@/utils/adminHook';
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
import { useState } from 'react';

const Login = () => {
  const { isLoading: isEmailSigninLoading, isError: isEmailSigninError, error: emailSigninError,isSuccess:isEmailSigninSuccess, mutateAsync: emailSigninMutation } = useEmailSigninMutation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () =>{
      try{
        await emailSigninMutation({
          email,
          password,
          userName:''
        })
      }catch(e){
        console.log("error on login:",e)
      }
    }
    
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
          <EuiFlexItem grow={false} style={{ width: '100%' }}>
            <EuiForm component="form">
            <EuiFormRow label="Email">
                <EuiFieldText
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow label="Password">
                <EuiFieldPassword
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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