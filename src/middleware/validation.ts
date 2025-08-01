import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  // Remove formatação
  const cpfNumbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpfNumbers.length !== 11) return false;
  
  // Verifica se não são todos os números iguais
  if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfNumbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfNumbers[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfNumbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfNumbers[10])) return false;
  
  return true;
};

// Validação de telefone brasileiro
export const validatePhone = (phone: string): boolean => {
  const phoneNumbers = phone.replace(/\D/g, '');
  // Telefone brasileiro: 10 ou 11 dígitos (com ou sem 9 no celular)
  return phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
};

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Middleware para validar parâmetros de busca de cliente
export const validateClientSearch = (req: Request, res: Response, next: NextFunction) => {
  const { cpf, telefone, email, search } = req.query;
  
  // Deve ter pelo menos um parâmetro de busca
  if (!cpf && !telefone && !email && !search) {
    throw new ApiError(
      400,
      'MISSING_SEARCH_PARAMS',
      'Pelo menos um parâmetro de busca deve ser fornecido: cpf, telefone, email ou search'
    );
  }
  
  // Validar CPF se fornecido
  if (cpf && typeof cpf === 'string') {
    if (!validateCPF(cpf)) {
      throw new ApiError(
        400,
        'INVALID_CPF',
        'CPF fornecido é inválido'
      );
    }
  }
  
  // Validar telefone se fornecido
  if (telefone && typeof telefone === 'string') {
    if (!validatePhone(telefone)) {
      throw new ApiError(
        400,
        'INVALID_PHONE',
        'Telefone fornecido é inválido'
      );
    }
  }
  
  // Validar email se fornecido
  if (email && typeof email === 'string') {
    if (!validateEmail(email)) {
      throw new ApiError(
        400,
        'INVALID_EMAIL',
        'Email fornecido é inválido'
      );
    }
  }
  
  next();
};

// Middleware para validar paginação
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, pageSize } = req.query;
  
  if (page && typeof page === 'string') {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ApiError(
        400,
        'INVALID_PAGE',
        'Parâmetro page deve ser um número maior que 0'
      );
    }
  }
  
  if (pageSize && typeof pageSize === 'string') {
    const pageSizeNum = parseInt(pageSize);
    if (isNaN(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 100) {
      throw new ApiError(
        400,
        'INVALID_PAGE_SIZE',
        'Parâmetro pageSize deve ser um número entre 1 e 100'
      );
    }
  }
  
  next();
};