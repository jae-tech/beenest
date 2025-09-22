import { TransactionType } from '@prisma/client';

/**
 * 거래번호 자동 생성 유틸리티
 *
 * 형식: {PREFIX}-{YYYYMMDD}-{SEQUENCE}
 * 예시:
 * - 매입: PUR-20241201-001
 * - 매출: SAL-20241201-001
 */
export class TransactionNumberGenerator {
  private static readonly PREFIXES = {
    [TransactionType.PURCHASE]: 'PUR',
    [TransactionType.SALE]: 'SAL',
  } as const;

  /**
   * 거래번호 생성
   * @param transactionType 거래 타입 (매입/매출)
   * @param transactionDate 거래일 (기본값: 오늘)
   * @param sequence 순번 (기본값: 자동 증가)
   * @returns 생성된 거래번호
   */
  static generate(
    transactionType: TransactionType,
    transactionDate?: Date,
    sequence?: number
  ): string {
    const prefix = this.PREFIXES[transactionType];
    const date = transactionDate || new Date();
    const dateString = this.formatDate(date);
    const sequenceString = sequence ? this.formatSequence(sequence) : '001';

    return `${prefix}-${dateString}-${sequenceString}`;
  }

  /**
   * 다음 거래번호 생성 (데이터베이스 조회 필요)
   * @param transactionType 거래 타입
   * @param transactionDate 거래일
   * @param getLastSequence 마지막 순번 조회 함수
   * @returns 생성된 거래번호
   */
  static async generateNext(
    transactionType: TransactionType,
    transactionDate: Date,
    getLastSequence: (prefix: string, dateString: string) => Promise<number>
  ): Promise<string> {
    const prefix = this.PREFIXES[transactionType];
    const dateString = this.formatDate(transactionDate);

    // 해당 날짜의 마지막 순번 조회
    const lastSequence = await getLastSequence(prefix, dateString);
    const nextSequence = lastSequence + 1;

    return this.generate(transactionType, transactionDate, nextSequence);
  }

  /**
   * 거래번호 파싱
   * @param transactionNumber 거래번호
   * @returns 파싱된 정보
   */
  static parse(transactionNumber: string): {
    transactionType: TransactionType | null;
    date: Date | null;
    sequence: number | null;
    isValid: boolean;
  } {
    const pattern = /^(PUR|SAL)-(\d{8})-(\d{3})$/;
    const match = transactionNumber.match(pattern);

    if (!match) {
      return {
        transactionType: null,
        date: null,
        sequence: null,
        isValid: false,
      };
    }

    const [, prefix, dateString, sequenceString] = match;

    // 거래 타입 매핑
    const transactionType = prefix === 'PUR' ? TransactionType.PURCHASE : TransactionType.SALE;

    // 날짜 파싱
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1; // Date는 0부터 시작
    const day = parseInt(dateString.substring(6, 8));
    const date = new Date(year, month, day);

    // 순번 파싱
    const sequence = parseInt(sequenceString);

    return {
      transactionType,
      date,
      sequence,
      isValid: true,
    };
  }

  /**
   * 거래번호 유효성 검사
   * @param transactionNumber 거래번호
   * @returns 유효성 여부
   */
  static isValid(transactionNumber: string): boolean {
    return this.parse(transactionNumber).isValid;
  }

  /**
   * 특정 날짜 범위의 거래번호 패턴 생성
   * @param transactionType 거래 타입
   * @param startDate 시작일
   * @param endDate 종료일
   * @returns 패턴 배열
   */
  static generateDateRangePatterns(
    transactionType: TransactionType,
    startDate: Date,
    endDate: Date
  ): string[] {
    const prefix = this.PREFIXES[transactionType];
    const patterns: string[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = this.formatDate(currentDate);
      patterns.push(`${prefix}-${dateString}-%`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return patterns;
  }

  /**
   * 날짜를 YYYYMMDD 형식으로 변환
   * @param date 날짜
   * @returns 포맷된 날짜 문자열
   */
  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
  }

  /**
   * 순번을 3자리 문자열로 변환
   * @param sequence 순번
   * @returns 포맷된 순번 문자열
   */
  private static formatSequence(sequence: number): string {
    return sequence.toString().padStart(3, '0');
  }

  /**
   * 월별 거래번호 프리픽스 생성 (통계 조회용)
   * @param transactionType 거래 타입
   * @param year 년도
   * @param month 월 (1-12)
   * @returns 월별 프리픽스
   */
  static getMonthlyPrefix(
    transactionType: TransactionType,
    year: number,
    month: number
  ): string {
    const prefix = this.PREFIXES[transactionType];
    const yearMonth = `${year}${month.toString().padStart(2, '0')}`;

    return `${prefix}-${yearMonth}`;
  }

  /**
   * 거래번호에서 순번 추출
   * @param transactionNumber 거래번호
   * @returns 순번 (실패시 0)
   */
  static extractSequence(transactionNumber: string): number {
    const parsed = this.parse(transactionNumber);
    return parsed.sequence || 0;
  }

  /**
   * 같은 날짜의 다음 거래번호 생성 (간단 버전)
   * @param lastTransactionNumber 마지막 거래번호
   * @returns 다음 거래번호
   */
  static getNextSequential(lastTransactionNumber: string): string | null {
    const parsed = this.parse(lastTransactionNumber);

    if (!parsed.isValid || !parsed.transactionType || !parsed.date || !parsed.sequence) {
      return null;
    }

    return this.generate(parsed.transactionType, parsed.date, parsed.sequence + 1);
  }
}