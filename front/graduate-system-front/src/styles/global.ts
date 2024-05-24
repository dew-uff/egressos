import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100%;
    display: table-cell;
    font: 400 16px Roboto, sans-serif;
  }
   html,
   body {
    height: 100%;
  }

   label{
     color: #4b907e;
   }

   //select{
   //  width: 300px;
   //  border: 3px solid #cbcbcb;
   //  border-radius: 8px;
   //  height: 48px;
   //  color: #4b907e;
   //  font-family: Roboto;
   //  font-size: 20px;
   //}
   //
   //select:active{
   //  border: 3px solid #cbcbcb !important;
   //}


  html {
    width: 100%;
    height: 100%;
    display: table;
    font-size: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  .formSecretaria{
    width: 1200px;
  }

  .radioInput{
    margin-left: 30px;
    margin-right: 5px;
    margin-top: 12px;
  }

  .radioInput2{
    margin-right: 5px;
    margin-top: 12px;
  }

  .radioLabel{
    margin-right: 20px;
    margin-top: 10px;
  }

  .columnsecretaria {
    float: left;
    width: 33%;
  }

  .card {
    border-radius: 5px;
    box-shadow: 7px 7px 13px 0px rgba(50, 50, 50, 0.22);
    padding: 30px;
    margin: 20px;
    width: 400px;
    transition: all 0.3s ease-out;
  }
  .card:hover {
    transform: translateY(-5px);
    cursor: pointer;
  }

  .card p {
    color: #a3a5ae;
    font-size: 16px;
  }


  .blue {
    border-left: 3px solid #4895ff;
  }

  .green {
    border-left: 3px solid #3bb54a;
  }

  .red {
    border-left: 3px solid #b3404a;
  }

  .preto{
    color: rgba(11,105,81,0.7);
  }

  .image {
    padding-top: 30px;
    float: right;
    max-width: 64px;
    max-height: 64px;
  }

  /* This is the style of our error messages */


  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ol,
  ul,
  p,
  fieldset {
    margin: 0;
    padding: 0;
  }

  a{
    text-decoration: none;
  }

  ol,
  ul {
    list-style: none;
  }

  .table-header{
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  table{
    border-collapse: collapse;
  }

  form{
    width: 100%;
  }

  .user{
    float: right;
    display: block;
    position: relative;
  }

  .cabecalho{
    width: 100%;
  }
  //
  //.colunameio{
  //  width: 80%;
  //}

  #__next {
    height: 100%;
  }

  .trash-icon{
    margin-left: 20px;
    cursor: pointer;
  }


  `
