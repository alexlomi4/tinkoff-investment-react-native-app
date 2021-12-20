import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import InvestmentServiceToken, {
  InvestmentService,
  InvestmentServiceStub,
} from 'tinkoff-investment-aggregate-service';

type ContentType = {
  serviceInstance: InvestmentService;
};

export const InvestmentContext = createContext<ContentType>({
  serviceInstance: new InvestmentServiceStub(),
});

type Props = {
  token: string;
  isProd?: boolean;
};

export function InvestmentProvider({
  children,
  token,
  isProd = true,
}: PropsWithChildren<Props>) {
  const [serviceInstance, setServiceInstance] = useState<InvestmentService>(
    token ? new InvestmentServiceToken(token) : new InvestmentServiceStub(),
  );
  useEffect(() => {
    if (token) {
      setServiceInstance(new InvestmentServiceToken(token, isProd));
    }
  }, [token, isProd]);

  const context = useMemo(
    () => ({
      serviceInstance,
    }),
    [serviceInstance],
  );
  return (
    <InvestmentContext.Provider value={context}>
      {children}
    </InvestmentContext.Provider>
  );
}
