import styled from 'styled-components'

export const Content = styled.div`
  //width: 100%;
  padding: 50px;
  //position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ImageLogo = styled.div`
  padding-top: 112px;
`

export const Column = styled.div`
  float: left;
  width: 50%;
`

export const Section = styled.div`
  width: ${({ width }: { width?: string }) => width ?? 100}%;
  padding-right: 10px;
  padding-bottom: 30px;
`

export const CheckboxLabel = styled.label`
  padding-left: 5px;
`

const alignCenter = `
align-content : center;
  flex-direction: column;
  flex-wrap: wrap;
`

export const Form = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  ${({ position }: { position?: string }) =>
    position === 'left' ? 'justify-content: left;' : alignCenter};
`

export const FormInputGroup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 67px;
  margin-bottom: 11px;
`

export const Title = styled.h1`
  padding-top: 24px;
  padding-bottom: 54px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 47px;

  color: #ffffff;
`

export const Label = styled.label`
  position: absolute;
  top: 16px;
  left: 20px;
  transition: all 0.3s ease;
  opacity: 0;
  color: #4b907e;
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
`

export const Input = styled.input`
  display: block;
  width: ${({ width }: { width?: number }) => (width ? `${width}px` : '100%')};
  //width: 300px;
  height: 48px;
  padding-left: 16px;
  transition: all 0.3s linear;
  border: 3px solid #cbcbcb;
  border-radius: 8px;
  background-color: #fff;
  color: #4b907e;
  font-family: Roboto;
  font-size: 20px;
  line-height: 23px;

  &:focus {
    outline: 0;
  }

  &:not(:placeholder-shown) {
    //padding-top: 26px;
    //padding-bottom: 14px;
    padding-left: 16px;
  }

  &:not(:placeholder-shown) + ${Label} {
    transform: translateY(-12px);
    opacity: 1;
  }

  &::placeholder {
    top: 0;
    color: #4b907e;
    font-size: 16px;
    font-style: normal;
    font-family: Roboto;
    letter-spacing: 0.48px;
    line-height: 19px;
  }
`

export const Error = styled.p`
  height: 30px;
  margin-top: 5px;
  color: #55c32d;
  font-size: 12px;
  line-height: lh(12px, 14px);
`

export const Button = styled.button`
  width: 154px;
  height: 46px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: #ffff;
  opacity: 0.8;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 23px;
  color: #4b907eff;
  border: none;

  &:hover {
    opacity: 1;
  }
`

export const Background = styled.div`
  background: rgba(11, 105, 81, 0.7);
  opacity: 0.99;
  height: 100%;
  width: 100%;
`

export const Row = styled.div`
  padding-top: 15px;
`
