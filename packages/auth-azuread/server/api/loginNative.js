import { finishAuth } from '@startupjs/auth/server'
import axios from 'axios'
import qs from 'query-string'
import nconf from 'nconf'
import { CALLBACK_NATIVE_AZUREAD_URL, FAILURE_LOGIN_URL, getStrBase64, SCOPE } from '../../isomorphic'
import Provider from '../Provider'

export default async function loginNative (req, res, next, config) {
  const { code } = req.query
  const {
    successRedirectUrl,
    clientId,
    tentantId,
    clientSecret,
    onLoginFinishHook,
    onLoginStartHook
  } = config

  const body = {
    client_id: clientId,
    scope: SCOPE,
    code,
    redirect_uri: nconf.get('BASE_URL') + CALLBACK_NATIVE_AZUREAD_URL,
    grant_type: 'authorization_code',
    code_verifier: getStrBase64(`${clientId}_${tentantId}`),
    client_secret: clientSecret
  }

  const tokenRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  try {
    const { data } = await axios.post(`https://login.microsoftonline.com/${tentantId}/oauth2/v2.0/token`, qs.stringify(body), tokenRequestConfig)

    const authHeaders = {
      headers: {
        Authorization: `${data.token_type} ${data.access_token}`
      }
    }

    const { data: profileData } = await axios.get('https://graph.microsoft.com/v1.0/me', authHeaders)
    const { mail, displayName, id } = profileData
    const [firstName = 'Unknown', lastName = 'Name'] = displayName.split(' ')

    const profile = {
      id,
      email: mail,
      lastName,
      firstName
    }

    const provider = new Provider(req.model, profile, config)
    const userId = await provider.findOrCreateUser()

    finishAuth(req, res, { userId, successRedirectUrl, onLoginFinishHook, onLoginStartHook })
  } catch (error) {
    console.log('[@dmapper/auth-azuread] Error: AzureAD login', error)
    return res.redirect(FAILURE_LOGIN_URL)
  }
}
