/**
 * Modelo de dados padrao para usuarios do sistema
 */
export class Usuario {
  nome: string = '';
  email: string = '';
  senha: string = '';
  /**
   * Retorna verdadeiro quando todas as propriedades possuem
   * valor
   */
  get valid(): boolean {
    return this.nome !== '' && this.email !== '' && this.senha !== '';
  }
}
